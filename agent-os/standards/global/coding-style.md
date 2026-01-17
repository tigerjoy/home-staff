## Coding style best practices

- **TypeScript First**: Use TypeScript for all code - leverage type safety to catch errors at compile time
- **Type Definitions**: Define explicit types for function parameters, return values, and component props - avoid `any` except in narrow cases
- **Interface vs Type**: Use `interface` for object shapes that may be extended, use `type` for unions, intersections, and computed types
- **Strict Mode**: Enable TypeScript strict mode in `tsconfig.json` - use `strict: true` or individual strict flags as appropriate
- **Generic Types**: Use generics for reusable functions and components - make components and utilities type-safe with generics
- **Type Inference**: Let TypeScript infer types when types are obvious from context - explicitly type when it improves readability or catches errors
- **Consistent Naming Conventions**: Use camelCase for variables and functions, PascalCase for components and types, UPPER_CASE for constants
- **Meaningful Names**: Choose descriptive names that reveal intent - avoid abbreviations and single-letter variables except in narrow contexts (e.g., loop counters)
- **Small, Focused Functions**: Keep functions small and focused on a single task - improves readability, testability, and maintainability
- **Consistent Indentation**: Use consistent indentation (2 spaces recommended for TypeScript/React) - configure ESLint/Prettier to enforce
- **Remove Dead Code**: Delete unused code, commented-out blocks, and unused imports - TypeScript and ESLint help identify these
- **DRY Principle**: Avoid duplication by extracting common logic into reusable functions, hooks, or utilities
- **ESLint and Prettier**: Use ESLint for code quality and Prettier for code formatting - enforce consistent style across the team
- **Import Organization**: Organize imports consistently - group by: external packages, internal modules, relative imports, types
- **Backward Compatibility**: Only when specifically instructed - assume you do not need to write additional code logic to handle backward compatibility
