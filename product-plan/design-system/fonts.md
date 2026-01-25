# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>` or import in your CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">
```

Or using CSS `@import`:

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Fira+Code:wght@400;500;600&display=swap');
```

## Font Usage

| Purpose | Font | Tailwind Class |
|---------|------|----------------|
| Headings | Nunito Sans | `font-sans` (configure in Tailwind) |
| Body text | Nunito Sans | `font-sans` |
| Code/technical | Fira Code | `font-mono` |

## Tailwind Configuration

If using Tailwind CSS, configure the fonts in your CSS:

```css
@theme {
  --font-sans: 'Nunito Sans', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;
}
```

## Font Weights Used

- **Regular (400):** Body text, descriptions
- **Medium (500):** Labels, secondary headings
- **Semibold (600):** Buttons, nav items
- **Bold (700):** Primary headings, emphasis
