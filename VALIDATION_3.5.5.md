# Game Theme Music 3.5.5 Validation

## Scope

3.5.5 is a Find Music / YouTube continuation repair built directly on 3.5.4. Import, AudioEngine, notification artwork, AmbientController, StoreController, downloader behavior, and the 3.0.7 live-theme baseline are intentionally preserved.

## Search architecture checks

- The frontend requests `search_yt_results_page` and falls back to the 3.5.4 `search_yt_results` RPC during a rolling Decky replacement.
- One backend `ytsearch600` process uses yt-dlp lazy-playlist streaming instead of launching `ytsearch20`, `ytsearch40`, `ytsearch60`, etc.
- The old yt-dlp `--match-filters duration<?1200` search-stage filter is removed from paged manager discovery.
- Duration filtering is applied after each raw row arrives, allowing later YouTube results to fill a short page.
- Backend pagination exposes explicit `has_more` and continuation/end state.
- Usable frontend discovery is capped at 200 rows per query; backend raw scanning is capped at 600 candidates.
- Search prefetch begins within the final 12 visible cards or about 900 px from the scroll end.
- YouTube thumbnails use `loading=lazy` and asynchronous decode hints.

## Synthetic regression checks

- PASS: with 11 long-form results among the first raw candidates, page 1 still fills to 20 usable tracks and page 2 continues to another 20.
- PASS: when the provider genuinely exhausts with only 9 usable tracks, the page returns 9 and `has_more=false` instead of looping forever.

## Static package checks

- JavaScript syntax: PASS
- Python compile: PASS
- plugin.json/package.json parse: PASS
- version metadata: 3.5.5
- ZIP integrity: PASS

## Steam Deck hardware checks

1. Search a broad artist/game query that previously returned 9 or 19 rows. Confirm GTM continues looking for later valid tracks instead of stopping because the first raw batch contained filtered long videos.
2. Browse beyond 20, 40, and 80 results on a broad query. Confirm new pages arrive automatically and focus remains stable.
3. Scroll quickly in Grid and List views. Confirm the next page begins loading before focus reaches the final row.
4. Confirm R2/Enter still submits manual searches exactly once.
5. Confirm Preview remains preview-only and does not automatically download or change Active.
6. Confirm 3.5.4 Import artwork/focus remains correct.
7. Install 3.5.5 while a downloaded/local main track is playing and verify the 3.5.3 update-continuity behavior still holds.
8. Confirm Now Playing notification artwork remains correct.
