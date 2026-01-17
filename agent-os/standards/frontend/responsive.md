## Responsive design best practices

- **Mobile-First Approach**: Start with mobile layout and progressively enhance for larger screens using Tailwind's responsive modifiers
- **Tailwind Breakpoints**: Consistently use Tailwind's standard breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) across the application
- **Breakpoint Usage**: Use `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes on utility classes to apply styles at specific breakpoints
- **Flexible Layouts**: Use Tailwind's flexbox and grid utilities with responsive modifiers for fluid, adaptive layouts
- **Relative Units in Tailwind**: Tailwind uses relative units (rem) by default - leverage spacing scale (`p-4`, `m-2`, etc.) for consistent spacing
- **Test Across Devices**: Test and verify UI changes across multiple screen sizes from mobile to tablet to desktop
- **Touch-Friendly Design**: Ensure tap targets are appropriately sized (minimum 44x44px) using Tailwind spacing utilities for mobile users
- **Performance on Mobile**: Use Tailwind's responsive image utilities and optimize assets for mobile network conditions
- **Readable Typography**: Use Tailwind's typography scale with responsive text size utilities (`text-sm md:text-base lg:text-lg`) for readable fonts across breakpoints
- **Content Priority**: Show the most important content first on smaller screens using Tailwind's display utilities (`hidden md:block`)
- **Container Queries**: Consider using container queries (when supported) for component-level responsive behavior alongside viewport breakpoints
