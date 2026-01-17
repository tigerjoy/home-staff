## Database query best practices

- **Supabase Query Builder**: Use Supabase's query builder methods (`.from()`, `.select()`, `.insert()`, `.update()`, `.delete()`) instead of raw SQL
- **Prevent SQL Injection**: Supabase client automatically prevents SQL injection through parameterized queries - never interpolate user input
- **Select Specific Columns**: Use `.select()` with specific column names rather than selecting all columns (`SELECT *`) for better performance
- **Query Filtering**: Use Supabase filter methods (`.eq()`, `.gt()`, `.lt()`, `.like()`, `.ilike()`, etc.) for filtering data
- **Avoid N+1 Queries**: Use `.select()` with join syntax or fetch related data in a single query rather than multiple sequential queries
- **Index Strategic Columns**: Index columns used in WHERE clauses, JOINs, and ORDER BY for query optimization
- **Use Transactions**: Wrap related database operations in transactions using Supabase Edge Functions or database functions when needed
- **Pagination**: Use `.range()` or `.limit()` with `.offset()` for pagination, or use cursor-based pagination with `.order()` and filter conditions
- **Query Timeouts**: Supabase handles query timeouts server-side - be aware of long-running queries and optimize as needed
- **Cache Expensive Queries**: Cache results of complex or frequently-run queries when appropriate - consider using React Query or SWR
- **Real-time Subscriptions**: Use `.on('*', ...)` or `.on('INSERT', ...)`, etc., for real-time subscriptions instead of polling
- **RLS Awareness**: Always test queries with RLS enabled - queries should work correctly within RLS policy constraints
- **Type Safety**: Use generated TypeScript types with Supabase queries for compile-time type checking
- **Error Handling**: Always check for errors in query responses and handle them appropriately
- **Query Optimization**: Profile slow queries using Supabase Dashboard and optimize using indexes, query structure, or database functions
