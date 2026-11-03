# Validation — Game Theme Music 3.5.9

## Purpose

3.5.9 is a controlled continuity-probe twin of 3.5.8. No intentional runtime/UI behavior changes were made beyond version metadata.

## Hardware test

1. Install 3.5.8 and verify Store Music plays in Decky Store.
2. Keep one cached/local Store track actively playing.
3. Install 3.5.9 from Decky Store without leaving the surface.
4. The same track should continue through unload/reinstall and remain at the same current position, with no duplicate audio and no restart at zero.
5. Back out of Decky Store and verify Store playback stops only when leaving Store surfaces according to normal Store rules.
