# Test Instructions: Landing Page

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

Test the marketing landing page including navigation, CTAs, and section display.

---

## User Flow Tests

### Flow 1: View Landing Page

**Scenario:** Visitor views the complete landing page

**Setup:**
- Provide all landing page data (hero, problems, features, testimonials, pricing, navigation, footer)

**Steps:**
1. Navigate to landing page at `/`

**Expected Results:**
- [ ] Navbar displays with logo "HomeStaff"
- [ ] Navbar shows navigation links: "Features", "Testimonials", "Pricing"
- [ ] Navbar shows "Login" and "Sign Up" buttons
- [ ] Hero section displays headline "Manage Your Household Staff with Ease"
- [ ] Hero section displays "Get Started Free" button
- [ ] Problems section displays 4 problem/solution cards
- [ ] Features section displays 6 feature cards with icons
- [ ] Testimonials section displays user quotes with names
- [ ] Pricing section displays "Free for Everyone" promotion
- [ ] Footer displays company name and social links
- [ ] Sticky CTA bar appears when scrolling

---

### Flow 2: Click Get Started CTA

**Scenario:** Visitor clicks the main call-to-action

**Setup:**
- Mock `onGetStarted` callback

**Steps:**
1. Click "Get Started Free" button in hero section

**Expected Results:**
- [ ] `onGetStarted` callback is called
- [ ] (In real app) User is redirected to `/register`

---

### Flow 3: Click Login

**Scenario:** Visitor clicks Login button

**Setup:**
- Mock `onLogin` callback

**Steps:**
1. Click "Login" button in navbar

**Expected Results:**
- [ ] `onLogin` callback is called
- [ ] (In real app) User is redirected to `/login`

---

### Flow 4: Navigate to Section

**Scenario:** Visitor clicks navigation link to scroll to section

**Setup:**
- Mock `onNavigate` callback

**Steps:**
1. Click "Features" link in navbar

**Expected Results:**
- [ ] `onNavigate` callback is called with `#features`
- [ ] (In real app) Page smooth-scrolls to Features section

---

## Component Interaction Tests

### Navbar

**Renders correctly:**
- [ ] Logo displays "HomeStaff"
- [ ] Navigation links are visible on desktop
- [ ] Hamburger menu appears on mobile
- [ ] Login and Sign Up buttons are visible

**User interactions:**
- [ ] Clicking "Login" calls `onLogin`
- [ ] Clicking "Sign Up" calls `onSignUp`
- [ ] Clicking nav link calls `onNavigate` with correct href

---

### Hero Section

**Renders correctly:**
- [ ] Headline text is visible
- [ ] Subtext is visible
- [ ] CTA button displays correct text

**User interactions:**
- [ ] Clicking CTA button calls `onGetStarted`

---

### Sticky CTA Bar

**Renders correctly:**
- [ ] Bar is hidden at top of page
- [ ] Bar appears when user scrolls down

**User interactions:**
- [ ] Clicking CTA in bar calls `onGetStarted`

---

## Responsive Tests

- [ ] Mobile: Navbar collapses to hamburger menu
- [ ] Mobile: Hero text is readable and not cut off
- [ ] Mobile: Feature grid stacks vertically
- [ ] Mobile: Testimonials stack vertically
- [ ] Tablet: Layout adjusts appropriately
- [ ] Desktop: Full navbar is visible

---

## Dark Mode Tests

- [ ] Background colors adapt to dark mode
- [ ] Text colors are readable in dark mode
- [ ] Buttons maintain proper contrast

---

## Accessibility Checks

- [ ] All images have alt text
- [ ] Navigation links are keyboard accessible
- [ ] CTA buttons have proper focus states
- [ ] Color contrast meets WCAG AA standards
