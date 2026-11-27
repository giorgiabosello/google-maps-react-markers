# Map styles

Light and dark styles that match the repository cover: navy ground, slate roads, deep blue water, dark green parks, and the same palette in light. Icons, points of interest, road names and transit are hidden.

Each style comes in two formats:

| Files                                             | Format                                                                             | Used for                                                                  |
| ------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `cover-dark.json`, `cover-light.json`             | legacy embedded JSON (`featureType`, `elementType`, `stylers`)                     | `options.styles` in code, on maps without a `mapId` (`lib/map-styles.ts`) |
| `cover-dark.cloud.json`, `cover-light.cloud.json` | cloud-based maps styling JSON (`variant`, `styles` with `id`, `geometry`, `label`) | the Google Cloud console, for maps with a `mapId`                         |

To use the cloud ones: Google Maps Platform → Map styles → Create style → JSON tab, paste the file, Customize, save, then attach the style to the map ID. The two formats are not interchangeable.

A cloud style document describes one variant only (`"variant": "light"` or `"dark"`), so the light and dark files are imported separately.
