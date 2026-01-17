## Vite best practices

- **Hot Module Replacement (HMR)**: Leverage Vite's fast HMR during development - changes to components and styles update instantly
- **Environment Variables**: Use `VITE_` prefix for environment variables that should be exposed to client code (e.g., `VITE_SUPABASE_URL`)
- **Build Optimization**: Trust Vite's production build process - it uses Rollup for optimized bundles with automatic code splitting
- **Import Path Aliases**: Configure path aliases in `vite.config.ts` (e.g., `@` for `src/`) for cleaner imports and better DX
- **TypeScript Configuration**: Ensure `tsconfig.json` path aliases match Vite config for proper type resolution
- **Asset Handling**: Use Vite's asset handling - import assets directly in code, and they'll be processed and optimized automatically
- **CSS Import**: Import global CSS files in `main.tsx` or `App.tsx` - Vite processes CSS with PostCSS and Tailwind automatically
- **Plugin Configuration**: Use Vite plugins for React (`@vitejs/plugin-react`) and Tailwind CSS integration as needed
- **Development Server**: Use Vite's dev server with automatic port detection and network exposure for team collaboration
- **Build Output**: Review build output for bundle size - use Vite's build analysis tools if bundle size becomes a concern
- **Proxy Configuration**: Configure proxy in `vite.config.ts` for API requests during development to avoid CORS issues
- **Module Resolution**: Leverage Vite's fast module resolution for quick dev server startup and HMR
