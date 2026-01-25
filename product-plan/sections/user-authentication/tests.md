# Test Instructions: User Authentication

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

---

## User Flow Tests

### Flow 1: Registration and Verification

**Scenario:** New user signs up and verifies their email

**Steps:**
1. Switch to "Register" tab.
2. Enter valid name, email, and password.
3. Click "Create Account".
4. Verify display switches to "Verification" screen.
5. Enter mock 6-digit code.
6. Verify `onRegister` callback is triggered.

**Expected Results:**
- [ ] Tabs switch correctly between Login and Register.
- [ ] Submit button is disabled until form is valid.
- [ ] Verification screen shows "Code sent to [email]".

### Flow 2: Password Recovery

**Scenario:** User resets a forgotten password

**Steps:**
1. On Login tab, click "Forgot Password".
2. Enter email and click "Send Code".
3. Verify verification screen appears.
4. Enter code and click "Verify".
5. Enter new password and confirm.
6. Click "Reset Password".

**Expected Results:**
- [ ] Form transitions logically through the recovery steps.
- [ ] Final step redirects or switches back to Login.

---

## Component Interaction Tests

### SocialAuthButtons
- [ ] Google button triggers `onSocialAuth` with 'google' provider.
- [ ] Facebook button triggers `onSocialAuth` with 'facebook' provider.

### VerificationFormComponent
- [ ] Auto-focuses the first digit input.
- [ ] Moves focus to next input as digits are entered.
- [ ] Allows backspace to move focus to previous input.

---

## Edge Cases

- [ ] **Invalid Code:** Verify error message shows when an incorrect code is submitted.
- [ ] **Weak Password:** Verify validation prevents submission of simple passwords.
- [ ] **Duplicate User:** Verify error handling when an email is already registered.

---

## Accessibility Checks

- [ ] Tabs are navigable via keyboard (Left/Right arrows).
- [ ] Form labels are correctly associated with inputs.
- [ ] Error messages use `aria-live` for screen reader announcement.

---

## Sample Test Data

```typescript
const mockAuthUser = {
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
};

const mockVerificationCode = "123456";
```
