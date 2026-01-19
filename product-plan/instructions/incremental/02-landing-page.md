# Milestone 2: Landing Page

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the Landing Page — a marketing page showcasing product features, benefits, and call-to-action for new users.

## Overview

The landing page is the public-facing marketing page that introduces HomeStaff to potential users. It features a headline-focused hero section, showcases product features and the problems it solves, displays testimonials, and highlights the current "Free for Limited Time" offer with a prominent sticky CTA bar.

**Key Functionality:**
- Display hero section with headline and primary CTA
- Showcase problems and solutions
- Feature grid displaying key product capabilities
- Testimonials carousel or grid
- Pricing section with promotional offer
- Sticky CTA bar at bottom
- Navigation to anchor sections and auth pages

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/landing-page/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

## What to Implement

### Components

Copy the section components from `product-plan/sections/landing-page/components/`:

- `LandingPage.tsx` — Main page component
- `Navbar.tsx` — Navigation bar with logo and links
- `HeroSection.tsx` — Hero with headline and CTA
- `ProblemsSection.tsx` — Problem/solution pairs
- `FeaturesSection.tsx` — Feature grid
- `TestimonialsSection.tsx` — User testimonials
- `PricingSection.tsx` — Promotional pricing banner
- `FooterSection.tsx` — Footer with links
- `StickyCtaBar.tsx` — Persistent bottom CTA

### Data Layer

The components expect these data shapes:

```typescript
interface LandingPageProps {
  hero: Hero
  problems: Problem[]
  features: Feature[]
  testimonials: Testimonial[]
  pricing: Pricing
  navigation: Navigation
  stickyCta: StickyCta
  footer: Footer
  onNavigate?: (href: string) => void
  onGetStarted?: () => void
  onLogin?: () => void
  onSignUp?: () => void
}
```

You'll need to:
- Provide content data (can be static or from CMS)
- Handle navigation callbacks

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onNavigate` | Called when user clicks a navigation link (smooth scroll to section) |
| `onGetStarted` | Called when user clicks the main CTA button → Navigate to `/register` |
| `onLogin` | Called when user clicks Login → Navigate to `/login` |
| `onSignUp` | Called when user clicks Sign Up → Navigate to `/register` |

## Files to Reference

- `product-plan/sections/landing-page/README.md` — Feature overview and design intent
- `product-plan/sections/landing-page/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/landing-page/components/` — React components
- `product-plan/sections/landing-page/types.ts` — TypeScript interfaces
- `product-plan/sections/landing-page/sample-data.json` — Test data
- `product-plan/sections/landing-page/screenshot.png` — Visual reference

## Expected User Flows

### Flow 1: View Landing Page and Sign Up

1. Visitor lands on the landing page at `/`
2. Visitor scrolls through hero, problems, features, testimonials, and pricing sections
3. Visitor clicks "Get Started Free" CTA button
4. **Outcome:** Visitor is redirected to `/register`

### Flow 2: Navigate to Login

1. Visitor clicks "Login" in the navigation bar
2. **Outcome:** Visitor is redirected to `/login`

### Flow 3: Navigate to Section

1. Visitor clicks a navigation link (e.g., "Features")
2. **Outcome:** Page smooth-scrolls to the corresponding section

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Landing page renders with all sections
- [ ] Hero section displays headline and CTA
- [ ] Problems section shows problem/solution pairs
- [ ] Features section displays feature grid
- [ ] Testimonials display with user quotes
- [ ] Pricing section shows promotional offer
- [ ] Footer displays with social and legal links
- [ ] Sticky CTA bar appears on scroll
- [ ] Navigation links scroll to sections
- [ ] CTA buttons navigate to registration
- [ ] Login button navigates to login page
- [ ] Responsive on mobile
- [ ] Dark mode support
