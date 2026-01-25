# Landing Page

## Overview

A high-converting marketing landing page that introduces HomeStaff to potential users. It features a headline-focused hero section, showcases product features and the problems it solves, displays testimonials, and highlights the current "Free for Limited Time" offer with a prominent sticky CTA bar.

## Key Functionality

- **Hero Section:** Large headline, supporting subtext, and a prominent "Get Started" CTA button.
- **Problem/Solution Section:** Highlights common household management pain points and how HomeStaff addresses them.
- **Features Overview:** Grid or cards showcasing key product capabilities (Staff Directory, Payroll, Attendance).
- **Testimonials:** User quotes with names and avatars to build trust.
- **Pricing Section:** Single promotional banner highlighting "Free for All for Limited Time".
- **Sticky CTA Bar:** Persistent bar at the bottom with a sign-up button, visible while scrolling to maintain conversion focus.
- **Navbar:** Navigation with logo, anchor links (Features, Testimonials, Pricing), and action buttons (Login, Sign Up).
- **Footer:** Company info, social media links, and legal/support links.

## User Flows

### Main Conversion Flow
1. Visitor lands on the page and reads the hero message.
2. Visitor scrolls through features and testimonials to understand value.
3. Visitor clicks "Get Started" in the Hero section or the Sticky CTA Bar.
4. Visitor is redirected to the registration page.

### Navigation Flow
1. Visitor clicks "Features" or "Pricing" in the Navbar.
2. The page smooth-scrolls to the respective section.
3. Visitor clicks "Login" to access their account.

## Design Decisions

- **Full-Screen Experience:** This section does not use the application shell to maximize visual impact and focus.
- **Smooth Scrolling:** Anchor links provide a fluid navigation experience within the single page.
- **Sticky CTA:** Ensures the primary action is always accessible regardless of scroll position.
- **Visual Hierarchy:** Large typography and generous whitespace to guide the user's eye.

## Components Provided

| Component | Description |
|-----------|-------------|
| `LandingPage` | Main page wrapper and layout |
| `Navbar` | Navigation bar with anchor links and login/signup buttons |
| `HeroSection` | Above-the-fold content with primary CTA |
| `ProblemsSection` | Pain point visualization |
| `FeaturesSection` | Grid of product features |
| `TestimonialsSection` | Customer quotes and social proof |
| `PricingSection` | Promotional offer section |
| `StickyCtaBar` | Persistent bottom bar |
| `FooterSection` | Site footer with secondary links |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onGetStarted` | Called when "Get Started" or "Sign Up" is clicked |
| `onLogin` | Called when "Login" is clicked |
| `onNavigate` | Internal callback for smooth-scrolling to sections |

## Empty States

- **No Testimonials:** Section is hidden if no testimonials are provided in the data.
- **No Features:** Section shows a simplified placeholder if feature list is empty.

## Visual Reference

See `LandingPagePreview-light.png` and `LandingPagePreview-dark.png` for the target UI design.
