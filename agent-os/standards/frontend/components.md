## UI component best practices

- **ShadCN Components**: Use ShadCN UI components as the primary component library, adding components via `npx shadcn@latest add [component-name]`
- **Component Location**: All ShadCN components live in `src/components/ui/` directory and can be imported from `@/components/ui/[component-name]`
- **Component Customization**: Customize components by directly editing the source files in `src/components/ui/` - they're part of your codebase, not node_modules
- **Radix UI Primitives**: ShadCN components are built on Radix UI primitives, providing accessibility and keyboard navigation out of the box
- **Tailwind CSS Styling**: All components use Tailwind CSS for styling - customize via Tailwind config and CSS variables
- **Component Composition**: Build complex UIs by composing ShadCN components together rather than modifying core component files
- **Conditional Classes**: Use the `cn()` utility function (typically from `@/lib/utils`) for conditional class merging with Tailwind classes
- **TypeScript**: All components are fully typed - leverage TypeScript for prop validation and autocomplete
- **Accessibility**: ShadCN components include ARIA attributes and keyboard navigation - maintain these when customizing
- **Component Variants**: Use the `variant` prop pattern (often via `cva` - class-variance-authority) for component variants
- **File Structure**: Keep component files in `src/components/ui/` with descriptive names matching the component (e.g., `button.tsx`, `dialog.tsx`)
- **Single Responsibility**: Each component should have one clear purpose - split complex components into smaller, composable pieces
- **Reusability**: Design components to be reused across different contexts with configurable props and variants
