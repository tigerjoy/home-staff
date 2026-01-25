# Test Instructions: Landing Page

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

---

## User Flow Tests

### Flow 1: Conversion Click

**Scenario:** User decides to sign up from the hero section

**Steps:**
1. Load landing page
2. Click "Get Started" button in the Hero section
3. Verify `onGetStarted` callback is triggered

**Expected Results:**
- [ ] Primary CTA button is clearly visible and clickable
- [ ] Redirect or callback happens immediately

### Flow 2: Navigation Smooth Scroll

**Scenario:** User wants to see pricing

**Steps:**
1. Load landing page
2. Click "Pricing" in the Navbar
3. Verify the window scrolls to the pricing section

**Expected Results:**
- [ ] Navbar anchor links are functional
- [ ] Scroll behavior is smooth (if possible to test in environment)

### Flow 3: Sticky CTA Visibility

**Scenario:** User scrolls down the page

**Steps:**
1. Load landing page
2. Scroll past the hero section
3. Verify Sticky CTA Bar becomes visible at the bottom

**Expected Results:**
- [ ] Sticky CTA Bar is hidden at the top (to avoid redundancy with Hero)
- [ ] Sticky CTA Bar appears after a certain scroll threshold

---

## Component Interaction Tests

### Navbar Component
- [ ] Displays logo correctly
- [ ] Shows Login and Sign Up buttons
- [ ] Anchor links match the section IDs on the page

### PricingSection Component
- [ ] Shows "Free for Limited Time" messaging prominently
- [ ] Does not show complex pricing tables (as per spec)

---

## Edge Cases

- [ ] Page renders correctly on mobile devices (responsive check)
- [ ] Navbar handles long list of links by wrapping or hiding (though current spec is minimal)
- [ ] Very short content (on large screens) doesn't break the layout

---

## Accessibility Checks

- [ ] All buttons have descriptive aria-labels
- [ ] Color contrast meets WCAG AA standards for both light and dark modes
- [ ] Navigation is possible via keyboard (Tab key)

---

## Sample Test Data

```typescript
const mockLandingData = {
  hero: {
    title: "Manage Your Household Staff with Ease",
    subtitle: "The all-in-one platform for payroll, attendance, and directory management."
  },
  features: [
    { title: "Staff Directory", description: "Keep all records in one place." },
    { title: "Smart Attendance", description: "Present by default tracking." }
  ],
  testimonials: [
    { name: "Anita Kapoor", quote: "HomeStaff changed my life!", avatar: "/avatars/anita.jpg" }
  ]
};
```
