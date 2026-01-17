## Tech stack

Define your technical stack below. This serves as a reference for all team members and helps maintain consistency across the project.

### Framework & Runtime
- **Application Framework:** Vite
- **Language/Runtime:** Node.js, TypeScript
- **Package Manager:** npm, yarn, or pnpm

### Frontend
- **JavaScript Framework:** React 18+
- **Type System:** TypeScript
- **CSS Framework:** Tailwind CSS
- **UI Components:** ShadCN Components (built on Radix UI primitives and Tailwind CSS)
- **Build Tool:** Vite

### Database & Storage
- **Database:** Supabase (PostgreSQL)
- **ORM/Query Builder:** Supabase JavaScript Client (PostgREST)
- **Storage:** Supabase Storage
- **Migrations:** Supabase CLI migrations

### Backend Services
- **Authentication:** Supabase Auth (email/password, OAuth providers)
- **API:** Supabase REST API (auto-generated from PostgREST), Supabase Edge Functions
- **Realtime:** Supabase Realtime (PostgreSQL changes, broadcasts, presence)
- **Serverless Functions:** Supabase Edge Functions (Deno runtime)

### Testing & Quality
- **Test Framework:** Vitest
- **Testing Utilities:** React Testing Library
- **Linting/Formatting:** ESLint, Prettier, TypeScript

### Deployment & Infrastructure
- **Frontend Hosting:** Vercel, Netlify, or similar
- **Backend Hosting:** Supabase Cloud (managed PostgreSQL, Auth, Storage, Realtime, Edge Functions)
- **CI/CD:** GitHub Actions, or platform-specific CI/CD

### Third-Party Services
- **Authentication:** Supabase Auth (built-in)
- **Database:** Supabase (PostgreSQL with Row Level Security)
- **Storage:** Supabase Storage (S3-compatible)
- **Realtime:** Supabase Realtime (WebSocket-based)
- **Monitoring:** Supabase Dashboard, Sentry (optional)
