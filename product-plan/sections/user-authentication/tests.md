# Test Instructions: User Authentication

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup.

## Overview

Test authentication flows including login, registration, social auth, email verification, and password reset.

---

## User Flow Tests

### Flow 1: Register with Email (Success)

**Scenario:** New user registers with email and password

**Setup:**
- Mock `onRegister` callback to succeed
- Mock `onVerifyCode` callback to succeed

**Steps:**
1. Navigate to `/register`
2. Click "Register" tab if not active
3. Enter "John Doe" in name field
4. Enter "john@example.com" in email field
5. Enter "Password123!" in password field
6. Enter "Password123!" in confirm password field
7. Click "Create account" button

**Expected Results:**
- [ ] `onRegister` is called with name, email, password
- [ ] Verification screen appears with message "Check your email"
- [ ] Email "john@example.com" is displayed on verification screen

**Next steps:**
8. Enter verification code "123456"
9. Click "Verify" button

**Expected Results:**
- [ ] `onVerifyCode` is called with "123456"
- [ ] (In real app) User redirected to Onboarding

---

### Flow 2: Register with Email (Validation Errors)

**Scenario:** User submits invalid registration data

**Steps:**
1. Leave name field empty
2. Enter "invalid-email" in email field
3. Enter "short" in password field
4. Enter "different" in confirm password field
5. Click "Create account" button

**Expected Results:**
- [ ] Error message "Please enter a valid email address" appears
- [ ] Error message about password requirements appears
- [ ] Error message "Passwords don't match" appears
- [ ] Form is not submitted
- [ ] `onRegister` is NOT called

---

### Flow 3: Login with Email (Success)

**Scenario:** Existing user logs in

**Setup:**
- Mock `onLogin` callback to succeed

**Steps:**
1. Navigate to `/login`
2. Enter "user@example.com" in email field
3. Enter "password123" in password field
4. Click "Sign in" button

**Expected Results:**
- [ ] `onLogin` is called with email and password
- [ ] Loading state shows "Signing in..."
- [ ] (In real app) User redirected to Staff Directory

---

### Flow 4: Login with Email (Invalid Credentials)

**Scenario:** User enters wrong password

**Setup:**
- Set `error` prop to "Invalid email or password"

**Steps:**
1. Enter email and password
2. Click "Sign in" button

**Expected Results:**
- [ ] Error message "Invalid email or password" is displayed
- [ ] Form data is preserved (not cleared)
- [ ] User can retry

---

### Flow 5: Social Auth (Google)

**Scenario:** User clicks Google login

**Setup:**
- Mock `onSocialAuth` callback

**Steps:**
1. Click "Continue with Google" button

**Expected Results:**
- [ ] `onSocialAuth` is called with "google"
- [ ] (In real app) OAuth popup/redirect opens

---

### Flow 6: Forgot Password (Complete Flow)

**Scenario:** User resets forgotten password

**Setup:**
- Mock all password reset callbacks

**Steps:**
1. On login form, click "Forgot password?"
2. Enter "user@example.com" in email field
3. Click "Send reset code"

**Expected Results:**
- [ ] `onForgotPassword` is called with email
- [ ] Code entry screen appears

**Next steps:**
4. Enter verification code "123456"
5. Click "Verify code"

**Expected Results:**
- [ ] Code verification screen advances
- [ ] New password form appears

**Next steps:**
6. Enter new password in both fields
7. Click "Reset password"

**Expected Results:**
- [ ] `onResetPassword` is called with new password
- [ ] Success message or redirect to login

---

## Empty State Tests

### No Errors

**Scenario:** Fresh form with no errors

**Expected Results:**
- [ ] No error messages displayed
- [ ] Form fields are empty
- [ ] Submit button is enabled

---

## Component Interaction Tests

### Tab Switching

**Steps:**
1. Click "Register" tab

**Expected Results:**
- [ ] Registration form is displayed
- [ ] `onTabChange` is called with "register"

---

### Loading State

**Setup:**
- Set `isLoading` prop to true

**Expected Results:**
- [ ] Submit button shows loading text ("Signing in..." or "Creating account...")
- [ ] Submit button is disabled
- [ ] Form fields may be disabled

---

## Accessibility Checks

- [ ] Form fields have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Tab navigation works correctly
- [ ] Focus moves to first invalid field on error
- [ ] Password field has show/hide toggle (if implemented)
