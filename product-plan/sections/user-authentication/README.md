# User Authentication

## Overview

A dedicated authentication page that handles user entry into the HomeStaff ecosystem. It features a unified interface for both registration and login using tabs, supports social authentication (Google, Facebook), and manages the full lifecycle of account verification and password recovery.

## Key Functionality

- **Tabbed Login/Register:** Seamlessly switch between existing user and new user views within a single card.
- **Social Auth Integration:** Quick access via Google and Facebook buttons.
- **Registration Flow:** Collects name, email, and password, followed by an email verification step.
- **Email Verification:** Interactive screen to enter a 6-digit code sent via email.
- **Forgot Password Flow:** Code-based recovery process to securely reset passwords without legacy email links.
- **Smart Redirects:** Automatically routes users to Onboarding (for new accounts) or the Staff Directory (for existing users).

## User Flows

### Registration Flow
1. User selects the **Register** tab.
2. User enters name, email, and password and clicks "Register".
3. System sends a verification code to the provided email.
4. User enters the code on the **Verification Screen**.
5. Upon success, user is redirected to the **Onboarding** wizard.

### Login Flow
1. User enters email and password in the **Login** tab.
2. User clicks "Login" (or uses a social auth provider).
3. If verified, user is redirected to the main dashboard or their previous page.
4. If the email is not verified, user is prompted to complete verification first.

### Password Recovery Flow
1. User clicks "Forgot Password" on the Login form.
2. User enters their email address.
3. User receives and enters a 6-digit verification code.
4. User sets a new password and is redirected back to Login.

## Design Decisions

- **No Shell:** The authentication page is a focused, centered card experience without navigation sidebars.
- **Mobile First:** Responsive layout that scales perfectly for phone users.
- **Inline Validation:** Real-time feedback on password strength and field requirements.
- **Single Page Interface:** Transitions between forms (Login -> Forgot Password -> Verification) happen within the same view state.

## Components Provided

| Component | Description |
|-----------|-------------|
| `UserAuthentication` | Main container and tab manager |
| `LoginFormComponent` | Email/password login form |
| `RegisterFormComponent` | New user registration form |
| `SocialAuthButtons` | Google and Facebook action buttons |
| `VerificationFormComponent` | 6-digit code entry interface |
| `ForgotPasswordComponent` | Email entry and password reset form |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onLogin` | Called on successful login |
| `onRegister` | Called on successful registration |
| `onSocialAuth` | Called when a social provider is clicked |
| `onVerify` | Called when a verification code is submitted |
| `onResetPassword` | Called when a new password is set |

## Empty States

- **Error States:** Comprehensive handling for "Invalid credentials", "User already exists", and "Invalid code".

## Visual Reference

See `UserAuthenticationPreview-light.png` and `UserAuthenticationPreview-dark.png` for the target UI design.
