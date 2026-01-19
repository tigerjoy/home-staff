# Tailwind Color Configuration

## Color Choices

- **Primary:** `amber` — Used for buttons, links, key accents, active states
- **Secondary:** `orange` — Used for tags, highlights, secondary elements, gradients
- **Neutral:** `stone` — Used for backgrounds, text, borders (warm gray palette)

## Usage Examples

### Primary (Amber)
```
Primary button: bg-amber-500 hover:bg-amber-600 text-white
Active nav item: bg-amber-50 text-amber-900 border-l-2 border-amber-500
Badge: bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300
Focus ring: focus:ring-2 focus:ring-amber-500
```

### Secondary (Orange)
```
Gradient accent: bg-gradient-to-br from-amber-400 to-orange-500
Secondary badge: bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300
Icon accent: text-orange-600 dark:text-orange-400
```

### Neutral (Stone)
```
Page background: bg-stone-50 dark:bg-stone-950
Card background: bg-white dark:bg-stone-900
Text primary: text-stone-900 dark:text-stone-100
Text secondary: text-stone-600 dark:text-stone-400
Text muted: text-stone-500 dark:text-stone-400
Border: border-stone-200 dark:border-stone-800
Input background: bg-stone-50 dark:bg-stone-800
```

## Dark Mode

All components use Tailwind's `dark:` variant for dark mode support. The design uses:
- `stone-950` for dark backgrounds
- `stone-900` for dark cards
- `stone-800` for dark borders and input backgrounds
- `stone-100` for dark text

## Semantic Colors

For specific states, these additional colors are used:
- **Success:** `emerald` — Active status, positive actions
- **Error:** `red` — Destructive actions, error states
- **Warning:** `amber` — Caution states (reusing primary)
