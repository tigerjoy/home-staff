# Landing Page

## Overview

A marketing landing page that introduces HomeStaff to potential users. It features a headline-focused hero section, showcases product features and the problems it solves, displays testimonials, and highlights the current "Free for Limited Time" offer with a prominent sticky CTA bar.

## User Flows

- Visitor lands on page → Scrolls through content → Clicks "Get Started" CTA → Redirects to registration
- Visitor clicks navigation links → Smooth-scrolls to corresponding section
- Visitor clicks Login → Redirects to login page

## Components Provided

| Component | Description |
|-----------|-------------|
| `LandingPage` | Main page composing all sections |
| `Navbar` | Navigation bar with logo, links, and auth buttons |
| `HeroSection` | Hero with headline and primary CTA |
| `ProblemsSection` | Problem/solution pairs |
| `FeaturesSection` | Feature grid with icons |
| `TestimonialsSection` | User testimonials |
| `PricingSection` | Promotional pricing banner |
| `FooterSection` | Footer with social and legal links |
| `StickyCtaBar` | Persistent bottom CTA bar |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onNavigate` | Called when user clicks a navigation link (smooth scroll) |
| `onGetStarted` | Called when user clicks main CTA → Navigate to `/register` |
| `onLogin` | Called when user clicks Login → Navigate to `/login` |
| `onSignUp` | Called when user clicks Sign Up → Navigate to `/register` |

## Design Notes

- Full-width sections with alternating backgrounds
- Hero uses amber accent for CTA button
- Sticky CTA bar appears on scroll (not fixed at top of page)
- Mobile-responsive with hamburger menu
- Dark mode supported
