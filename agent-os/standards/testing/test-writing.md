## Test coverage best practices

- **Vitest Configuration**: Use Vitest as the test framework - configure via `vitest.config.ts` with React Testing Library and DOM environment
- **React Testing Library Integration**: Use React Testing Library for React component testing - focus on testing behavior and user interactions, not implementation details
- **Test Structure**: Use `describe` blocks to group related tests and `test` or `it` for individual test cases - keep tests focused and readable
- **Write Minimal Tests During Development**: Do NOT write tests for every change or intermediate step - focus on completing feature implementation first, then add strategic tests at logical completion points
- **Test Only Core User Flows**: Write tests exclusively for critical paths and primary user workflows - skip writing tests for non-critical utilities and secondary workflows until instructed
- **Defer Edge Case Testing**: Do NOT test edge cases, error states, or validation logic unless they are business-critical - address these in dedicated testing phases
- **Test Behavior, Not Implementation**: Focus tests on what the code does, not how it does it - reduce brittleness by testing user-facing behavior
- **Clear Test Names**: Use descriptive names that explain what's being tested and the expected outcome - follow pattern: "should [expected behavior] when [condition]"
- **Mock External Dependencies**: Mock Supabase client, APIs, and other external services - use Vitest's `vi.mock()` to isolate units
- **Fast Execution**: Keep unit tests fast (milliseconds) so developers run them frequently during development - Vitest's watch mode helps with this
- **Async Testing**: Use `async/await` or `.resolves/.rejects` for async operations - React Testing Library's `waitFor` for async UI updates
- **Snapshot Testing**: Use Vitest snapshots sparingly for stable UI components - prefer testing user interactions over snapshots when possible
- **Testing React Components**: Use `render()` from React Testing Library, query by accessible queries (getByRole, getByLabelText), and simulate user interactions with `fireEvent` or `userEvent`
- **Mocking Supabase**: Mock Supabase client calls using Vitest's `vi.mock()` - create mock implementations for `supabase.auth`, `supabase.from()`, `supabase.storage`, etc.
- **Test Cleanup**: Always clean up after tests - unmount components, clear mocks, reset state - Vitest provides `afterEach` hooks for cleanup
- **Coverage Goals**: Aim for meaningful coverage on critical paths, not 100% coverage everywhere - focus on user-facing functionality and business logic
