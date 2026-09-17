# Product card

Home catalog tile in `Card.jsx` / `Card.module.css`. Home passes each DummyJSON product, the View Product path, and the list index.

## Layout

The whole tile is a link. There is no **View Product** button.

- Portrait image (`3:4`, `object-fit: cover`) from DummyJSON `images[0]`, with `thumbnail` as fallback
- Muted uppercase kicker (`brand`, or `category` if brand is missing)
- Title, two-line clamp (`data-testid="title"`)
- Price as the CTA; **View →** appears on hover beside it

## Motion

| When | What |
| --- | --- |
| Catalog appears or `searchProduct` changes | Cards fade and rise; delay is `min(index, 9) * 40ms`. Home remounts tiles with `catalogKey` so category and search replay the stagger. |
| Gallery image loads | Image fades in. Cached images use `complete` so they do not stay hidden. |
| Hover | Image scales to `1.04`, kicker and title go charcoal, **View →** fades in. |
| `prefers-reduced-motion: reduce` | No zoom, rise, or stagger delay. Opacity can still change immediately. |

## Spinner

If `item` or `linkTo` is missing, the card shows `SpinnerComponent` instead of the tile.
