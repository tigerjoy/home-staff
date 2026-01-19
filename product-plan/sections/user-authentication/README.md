# User Authentication

## Overview

A single authentication page with tabbed Login/Register views, supporting both Social Auth (Google, Facebook) and email/password. Features email verification for new signups, code-based password reset, and smart post-login redirects based on user state.

## User Flows

- **Registration:** User enters name, email, password → Receives verification email → Enters code → Account created → Redirects to Onboarding
- **Login:** User enters email/password OR clicks Social Auth → Authenticated → Redirects to Dashboard
- **Forgot Password:** User enters email → Receives code → Enters code → Sets new password → Redirects to Login

## Components Provided

| Component | Description |
|-----------|-------------|
| `UserAuthentication` | Main auth page with tabbed views |
| `SocialAuthButtons` | Google and Facebook login buttons |
| `LoginFormComponent` | Email/password login form |
| `RegisterFormComponent` | Registration form with validation |
| `VerificationFormComponent` | 6-digit code verification form |
| `ForgotPasswordComponent` | Password reset flow |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onLogin` | Submit login credentials |
| `onRegister` | Submit registration form |
| `onSocialAuth` | Initiate OAuth flow with provider ID |
| `onVerifyCode` | Verify email/reset code |
| `onResendCode` | Request new verification code |
| `onForgotPassword` | Request password reset email |
| `onResetPassword` | Set new password after verification |
| `onTabChange` | Switch between Login and Register tabs |
| `onBack` | Return to previous step |

## Design Notes

- Centered card layout with logo at top
- Social auth buttons prominently displayed
- Tab navigation between Login and Register
- Inline validation and error messages
- Loading states during async operations
