## Supabase Authentication best practices

- **Client Initialization**: Initialize Supabase client with `createClient()` from `@supabase/supabase-js` using your project URL and publishable key
- **Session Management**: Use `supabase.auth.getSession()` for client-side session checks and `supabase.auth.getUser()` for server-side validation (always validates JWT)
- **Email/Password Authentication**: Use `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()` for email/password authentication
- **Magic Links (Passwordless)**: Use `supabase.auth.signInWithOtp()` for passwordless authentication via magic links
- **Social Authentication**: Configure OAuth providers (Google, GitHub, etc.) in Supabase Dashboard and use `supabase.auth.signInWithOAuth()` for social login
- **Session Storage**: Supabase client automatically handles session storage in localStorage (client-side) or cookies (server-side with `@supabase/ssr`)
- **Auth State Changes**: Use `supabase.auth.onAuthStateChange()` to listen for authentication state changes and update UI accordingly
- **Row Level Security (RLS)**: Always use RLS policies with `auth.uid()` to ensure users can only access their own data or authorized data
- **Protecting Routes**: Check authentication state before rendering protected content - use `supabase.auth.getUser()` in server components or `useEffect` in client components
- **Sign Out**: Use `supabase.auth.signOut()` to sign out users - clears session on both client and server
- **Email Templates**: Customize email templates (confirmation, password reset, etc.) in Supabase Dashboard under Authentication > Email Templates
- **Password Reset**: Use `supabase.auth.resetPasswordForEmail()` to send password reset emails - handle the callback URL to allow password updates
- **Email Confirmation**: Configure email confirmation in Supabase Dashboard - handle the confirmation callback URL to verify users
- **User Metadata**: Store additional user information in `user_metadata` or create a separate `profiles` table with RLS policies
- **Error Handling**: Always handle authentication errors gracefully - check `error` property in responses and display user-friendly messages
