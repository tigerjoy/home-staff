## CSS best practices

- **Tailwind CSS First**: Use Tailwind CSS utility classes as the primary method for styling - prefer utilities over custom CSS
- **Utility-First Approach**: Leverage Tailwind's utility classes to build designs directly in your markup rather than writing custom CSS
- **Custom Theme Configuration**: Configure design tokens (colors, spacing, typography, breakpoints) via `tailwind.config.js` or `tailwind.config.ts`
- **CSS Variables for Theming**: Use CSS variables (defined in `:root` or component-specific scopes) for dynamic theming - ShadCN uses this pattern extensively
- **Avoid Overriding Framework Styles**: Work with Tailwind's design system rather than fighting against it with excessive custom CSS
- **Minimize Custom CSS**: Only write custom CSS when Tailwind utilities don't cover your needs - leverage `@apply` sparingly for component-level abstractions
- **Use @apply Sparingly**: Prefer utility classes in markup; use `@apply` only for repeated patterns within component stylesheets
- **JIT Compiler Benefits**: Tailwind's JIT mode ensures only used classes are included in production builds - write utilities freely
- **Responsive Design**: Use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, etc.) for mobile-first responsive design
- **Dark Mode**: Leverage Tailwind's dark mode support with `dark:` prefix - configure via `tailwind.config.js` (class or media strategy)
- **CSS Purging**: Tailwind automatically removes unused CSS in production builds - no manual purging needed with JIT mode
- **Performance**: Trust Tailwind's production build process to optimize CSS bundle size through tree-shaking
