## Database model best practices

- **PostgreSQL Table Design**: Design tables using standard PostgreSQL data types and constraints following Supabase conventions
- **Row Level Security (RLS)**: Enable RLS on all tables containing user data - RLS is critical for data security in Supabase
- **RLS Policies**: Create granular RLS policies using `auth.uid()` to ensure users can only access their own data or data they're authorized to see
- **Timestamps**: Include `created_at` and `updated_at` timestamp columns on all tables (use `timestamptz` type) - Supabase doesn't auto-add these
- **Primary Keys**: Use UUIDs (`uuid` type) as primary keys, especially for user-related tables - reference `auth.users.id` directly
- **Foreign Keys**: Use foreign key constraints to maintain referential integrity - reference `auth.users(id)` for user relationships
- **Supabase Migrations**: Use Supabase CLI migrations (`supabase migration new [name]`) to version control schema changes
- **Type Generation**: Generate TypeScript types from your database schema using `supabase gen types typescript` and keep them in sync
- **Data Types**: Choose appropriate PostgreSQL data types - use `jsonb` for flexible schema, `text` for strings, `boolean` for flags
- **Indexes on Foreign Keys**: Index foreign key columns and other frequently queried fields for performance
- **Validation at Multiple Layers**: Implement validation at both database level (constraints, triggers) and application level
- **Relationship Clarity**: Define relationships clearly with appropriate cascade behaviors (`ON DELETE CASCADE` vs `ON DELETE SET NULL`)
- **Naming Conventions**: Use snake_case for table and column names - this matches PostgreSQL conventions and Supabase defaults
- **Avoid Over-Normalization**: Balance normalization with practical query performance needs - denormalize when it improves read performance
