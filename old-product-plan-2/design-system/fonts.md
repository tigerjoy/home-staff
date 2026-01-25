# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Nunito+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Or import in your CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Nunito+Sans:wght@400;500;600;700&display=swap');
```

## Font Usage

| Usage | Font | Weights |
|-------|------|---------|
| Headings | Nunito Sans | 600, 700 |
| Body text | Nunito Sans | 400, 500 |
| Navigation | Nunito Sans | 500, 600 |
| Code/technical | Fira Code | 400, 500 |

## CSS Custom Properties

```css
:root {
  --font-heading: 'Nunito Sans', sans-serif;
  --font-body: 'Nunito Sans', sans-serif;
  --font-mono: 'Fira Code', monospace;
}
```

## Usage Examples

```html
<!-- Heading -->
<h1 style="font-family: 'Nunito Sans', sans-serif; font-weight: 700;">
  Staff Directory
</h1>

<!-- Body text -->
<p style="font-family: 'Nunito Sans', sans-serif; font-weight: 400;">
  Manage your household staff profiles.
</p>

<!-- Code -->
<code style="font-family: 'Fira Code', monospace;">
  employee.holidayBalance
</code>
```

## Tailwind Integration

If using Tailwind, you can set up font families in your CSS:

```css
@layer base {
  body {
    font-family: 'Nunito Sans', sans-serif;
  }
}
```

Or use inline styles as shown in the components:

```tsx
<span style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
  HomeStaff
</span>
```
