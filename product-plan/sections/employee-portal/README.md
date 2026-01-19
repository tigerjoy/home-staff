# Employee Portal

## Overview

A public-facing, read-only portal that provides domestic staff with transparent access to their employment records. Employees can verify their attendance, holiday balance, and payment history using only their registered phone number.

## User Flows

- Enter phone number to access records
- View current holiday balance
- View attendance summary
- View payment history
- View basic profile information
- Mobile-first, read-only interface

## Components Provided

| Component | Description |
|-----------|-------------|
| `EmployeePortal` | Full portal with login and dashboard |

## Callback Props

| Callback | Description |
|----------|-------------|
| `onLogin` | Look up employee by phone number |
| `onLogout` | Clear session, return to login |
| `onViewActivityDetail` | Show detail for activity item |

## Design Notes

- Simple phone number input (no account needed)
- Mobile-first responsive design
- High legibility for basic smartphones
- Read-only — no edit actions
- Activity feed combines attendance and payments
- Summary cards show key metrics at a glance
