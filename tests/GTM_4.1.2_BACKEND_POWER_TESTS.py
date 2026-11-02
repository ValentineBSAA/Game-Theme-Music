"""Offline regression for Linux suspend-clock fallback, no SteamOS required."""
import ast
import asyncio
from pathlib import Path

source = (Path(__file__).parent.parent / 'main.py').read_text()
root = ast.parse(source)
plugin = next(n for n in root.body if isinstance(n, ast.ClassDef) and n.name == 'Plugin')
methods = [n for n in plugin.body if isinstance(n, (ast.FunctionDef,ast.AsyncFunctionDef)) and n.name in {'_read_power_sleep_offset','get_power_state'}]
assert len(methods)==2
cl = ast.ClassDef(name='PowerStub',bases=[],keywords=[],body=methods,decorator_list=[])
ns={}
class FakeTime:
    CLOCK_BOOTTIME=7
    def __init__(self):self.awake=1000.;self.slept=0.
    def clock_gettime(self,_):return self.awake+self.slept
    def monotonic(self):return self.awake
clock=FakeTime()
class DeckyMock:
    events=[]
    @classmethod
    async def emit(cls,*args):cls.events.append(args)
ns.update(time=clock,decky=DeckyMock,AttributeError=AttributeError,OSError=OSError,ValueError=ValueError)
exec(compile(ast.fix_missing_locations(ast.Module(body=[cl],type_ignores=[])),'test','exec'),ns)
async def run():
    obj=ns['PowerStub']()
    obj._power_sleep_offset=obj._read_power_sleep_offset()
    obj._power_last_wake_time=0
    obj._power_seq=0
    obj._power_sleeping=True
    obj._power_monitoring=False
    assert (await obj.get_power_state())['seq']==0
    clock.awake+=5
    assert (await obj.get_power_state())['seq']==0
    clock.slept+=47
    d=await obj.get_power_state()
    assert d['seq']==1 and not d['sleeping'] and not d['monitoring'],d
    assert len(DeckyMock.events)==1 and DeckyMock.events[0][0]=='gtm_power_v412'
    assert (await obj.get_power_state())['seq']==1,'stale wake must not re-arm delay'
    # A logind event moments earlier means our clock fallback won't double-emit.
    clock.awake+=1
    obj._power_last_wake_time=clock.monotonic()
    clock.slept+=5
    assert (await obj.get_power_state())['seq']==1
    print('PASS 4.1.2 backend: BOOTTIME/MONOTONIC suspend differential, one wake, no duplicate logind signal')
asyncio.run(run())
