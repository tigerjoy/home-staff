# Milestone 2: Landing Page

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions (see `product-plan/sections/landing-page/tests.md`)

**What you need to build:**
- Routing for public landing page
- Anchor link navigation logic (smooth scroll)
- Navigation to Login and Registration pages
- Integration of the provided UI components

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing
- **DO** use test-driven development — write tests first using `tests.md` instructions

---

## Goal
Create a public-facing marketing presence that introduces the product to potential users and drives them toward registration.

## Overview
A high-conversion landing page featuring a headline-focused hero section, clear problem/solution messaging, feature highlights, and social proof via testimonials. It uses a persistent "Sticky CTA Bar" to ensure the "Get Started" action is always within reach.

**Key Capabilities:**
- Responsive navigation with anchor links
- Hero section with primary CTA
- Problem vs. Solution breakdown
- Feature grid showcasing product value
- Social proof via customer testimonials
- Simple pricing/offer highlight
- Sticky conversion bar for mobile and desktop

## Recommended Approach: Test-Driven Development
Follow the TDD instructions in `product-plan/sections/landing-page/tests.md`. Start by testing the navigation links and the visibility of the "Get Started" CTAs.

## What to Implement

### Components
Copy these from `product-plan/sections/landing-page/components/`:
- `LandingPage.tsx` — The main page layout
- `Navbar.tsx` — Navigation with anchor links and Auth buttons
- `HeroSection.tsx` — Main value proposition and primary CTA
- `ProblemsSection.tsx` — Pain point identification
- `FeaturesSection.tsx` — Feature grid
- `TestimonialsSection.tsx` — Customer quotes
- `PricingSection.tsx` — "Free for Limited Time" promotion
- `FooterSection.tsx` — Legal and social links
- `StickyCtaBar.tsx` — Persistent bottom conversion bar

### Data Layer
The landing page is primarily static. Use the content from `product-plan/sections/landing-page/sample-data.json` to populate the testimonials and features.

### Callbacks
- `onGetStarted`: Redirect to `/register`
- `onLogin`: Redirect to `/login`
- `onNavClick`: Implement smooth scroll to section IDs (`#features`, `#testimonials`, `#pricing`)

### Empty States
N/A - This is a static marketing page.

## Files to Reference
- `product-plan/sections/landing-page/spec.md` — UI requirements
- `product-plan/sections/landing-page/sample-data.json` — Text content
- `product-plan/sections/landing-page/types.ts` — Prop definitions

## Expected User Flows
1. **The Discovery Flow:** Visitor lands on page → Reads Hero → Scrolls through Problems and Features → Clicks "Get Started" in the Sticky CTA Bar → Redirects to `/register`.
2. **The Navigation Flow:** Visitor clicks "Testimonials" in the Navbar → Page smooth-scrolls to the Testimonials section.
3. **The Returning User Flow:** Visitor clicks "Login" in the Navbar → Redirects to `/login`.

## Done When
- [ ] Landing page is accessible at `/`
- [ ] All sections render correctly in light and dark mode
- [ ] Navbar links smooth-scroll to correct sections
- [ ] "Get Started" buttons redirect to registration
- [ ] Sticky CTA bar appears/remains visible as designed
- [ ] Layout is responsive on mobile devices
- [ ] All tests in `tests.md` pass
