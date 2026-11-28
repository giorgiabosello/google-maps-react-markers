---
'google-maps-react-markers': patch
---

`options` changes apply only the keys that changed: changing one option (for example `styles`) no longer re-applies the others over what the user did on the map, such as the map type picked with Google's control. `<MapControl>` keeps its content mounted when `position` changes, so React state inside it survives, and it logs an error for an invalid position instead of rendering nothing silently.
