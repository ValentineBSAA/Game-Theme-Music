# Game Theme Music 3.0.3

Hardware-feedback correction for 3.0.2.

The key regression was cross-document behavior: Decky plugin code can execute in a different document from the rendered panel. 3.0.2 checked global `document` for the panel before accepting LB/RB and also applied adaptive theme variables to the global document. Both were wrong on the Deck.

3.0.3 roots controller visibility, focus lookup, theme sampling, CSS variables, and MutationObserver work in the rendered panel's `ownerDocument`. The banner is also focusable and opens Now Playing.

Legacy metadata repair now runs automatically in bounded batches and remains available manually from Ambient/Library.
