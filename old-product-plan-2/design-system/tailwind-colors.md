# Tailwind Color Configuration

## Color Choices

- **Primary:** `amber` — Used for buttons, links, key accents
- **Secondary:** `orange` — Used for tags, highlights, secondary elements
- **Neutral:** `stone` — Used for backgrounds, text, borders

## Usage Examples

### Primary (Amber)

```html
<!-- Primary button -->
<button class="bg-amber-600 hover:bg-amber-700 text-white">
  Save Changes
</button>

<!-- Primary link -->
<a class="text-amber-600 hover:text-amber-700 dark:text-amber-400">
  Learn more
</a>

<!-- Active navigation item -->
<div class="bg-amber-50 text-amber-900 border-l-2 border-amber-500 dark:bg-amber-400/20 dark:text-amber-300">
  Staff Directory
</div>
```

### Secondary (Orange)

```html
<!-- Badge/tag -->
<span class="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
  New
</span>

<!-- Hover accent -->
<div class="hover:bg-orange-50 dark:hover:bg-orange-950">
  Hover me
</div>
```

### Neutral (Stone)

```html
<!-- Page background -->
<div class="bg-stone-50 dark:bg-stone-950">

<!-- Card background -->
<div class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">

<!-- Text colors -->
<h1 class="text-stone-900 dark:text-stone-100">Heading</h1>
<p class="text-stone-600 dark:text-stone-400">Body text</p>
<span class="text-stone-500">Muted text</span>

<!-- Borders -->
<div class="border-stone-200 dark:border-stone-800">
```

## Dark Mode

All components use Tailwind's `dark:` variant for dark mode support. The design system uses:

- **Light mode:** Stone-50 backgrounds, stone-900 text
- **Dark mode:** Stone-950 backgrounds, stone-100 text

## Tailwind v4 Note

This project uses Tailwind CSS v4. There is no `tailwind.config.js` file. Colors are used directly via Tailwind's built-in utility classes.
