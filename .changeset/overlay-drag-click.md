---
'google-maps-react-markers': patch
---

Clicks on buttons, links and other elements inside a draggable overlay marker reach them again. The overlay drag no longer uses pointer capture, which sent the click to the marker container; it follows the pointer on `window`, and the click that ends a drag is still swallowed, on the marker and on the map.
