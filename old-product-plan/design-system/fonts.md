# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;1,6..12,400&display=swap" rel="stylesheet">
```

Or import in your CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;1,6..12,400&display=swap');
```

## Font Usage

### Nunito Sans (Headings & Body)
A friendly, rounded sans-serif that balances professionalism with approachability. Used for all UI text including headings, labels, and body copy.

```css
font-family: 'Nunito Sans', sans-serif;
```

Weights used:
- `400` — Regular body text
- `500` — Medium emphasis (labels, nav items)
- `600` — Semibold (subheadings, table headers)
- `700` — Bold (headings, emphasis)

### Fira Code (Monospace)
A monospace font with programming ligatures. Used for code snippets, technical data, and formatted numbers.

```css
font-family: 'Fira Code', monospace;
```

Weights used:
- `400` — Regular code
- `500` — Medium emphasis
- `600` — Bold code

## Tailwind Configuration

If using Tailwind, extend your theme:

```js
// tailwind.config.js (Tailwind v3)
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
}
```

For Tailwind v4, use CSS variables:

```css
/* app.css */
@theme {
  --font-sans: 'Nunito Sans', sans-serif;
  --font-mono: 'Fira Code', monospace;
}
```
