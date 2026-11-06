# Game Theme Music 3.4.2 — Manager Context & Search UX

## UX contract

- Physical LB/RB changes top-level Soundtrack Manager sections.
- D-pad / left stick remains owned only by Decky native Focusable navigation.
- B uses Steam/Decky native Back. GTM adds same-route history entries for drill-ins so B returns one manager page at a time.
- A game selection is a drill-in level. Music Library, Find Online, and Import Local opened from that game are another level and retain that game as the destination.
- Find Online from a game automatically searches `<game title> soundtrack`; users can edit the query after the automatic search finishes.
- Find Music supports Grid and List views. Grid is grouped as controller rows rather than a flat DOM list.
- Library selection never inserts/removes the action bar; the list geometry stays stable while tracks are marked.
- The Library always states exactly where selected tracks will be added.

## Locked systems

3.4.2 must not rewrite the 3.0.7 live theme engine or the proven 3.0.7 physical LB/RB handler. It also keeps 3.4.1's removal of the duplicate D-pad listener.
