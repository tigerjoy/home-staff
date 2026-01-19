# Employee Portal

## Overview

A public-facing, read-only portal that provides domestic staff with transparent access to their employment records. Employees can verify their attendance, holiday balance, and payment history using only their registered phone number.

## User Flows

- Simple phone number login (no password)
- View dashboard with key metrics
- See holiday balance and absence count
- View payment history
- See activity timeline
- Mobile-first, accessible on basic smartphones
- Read-only — no edit actions

## Components Provided

- `EmployeePortal.tsx` — Complete portal with login and dashboard

## Callback Props

| Callback | Description |
|----------|-------------|
| `onLogin(phoneNumber)` | Authenticate with phone number |
| `onLogout()` | Clear session and return to login |
| `onViewActivityDetail(id)` | View more details for activity item |

## Key Features

- **No Password Required:** Simple phone lookup
- **Mobile-First:** Optimized for small screens
- **Read-Only:** No edit actions anywhere
- **Public Access:** No authentication session required

## Visual Reference

See screenshots in `product/sections/employee-portal/` for the target UI design.
