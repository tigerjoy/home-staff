# Tailwind Color Configuration

## Color Choices

- **Primary:** `amber` — Used for buttons, links, key accents
- **Secondary:** `orange` — Used for tags, highlights, secondary elements
- **Neutral:** `stone` — Used for backgrounds, text, borders

## Usage Examples

### Primary (Amber)
```
Primary button: bg-amber-500 hover:bg-amber-600 text-white
Primary text: text-amber-600 dark:text-amber-400
Primary border: border-amber-500
Primary background: bg-amber-50 dark:bg-amber-950
```

### Secondary (Orange)
```
Secondary badge: bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200
Secondary accent: text-orange-500
Gradient: bg-gradient-to-r from-amber-500 to-orange-500
```

### Neutral (Stone)
```
Page background: bg-stone-50 dark:bg-stone-950
Card background: bg-white dark:bg-stone-900
Text primary: text-stone-900 dark:text-stone-100
Text secondary: text-stone-600 dark:text-stone-400
Text muted: text-stone-500 dark:text-stone-500
Borders: border-stone-200 dark:border-stone-800
```

## Common Patterns

### Buttons
```tsx
// Primary
className="bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl px-4 py-2"

// Secondary
className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"

// Ghost
className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
```

### Cards
```tsx
className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6"
```

### Inputs
```tsx
className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
```
