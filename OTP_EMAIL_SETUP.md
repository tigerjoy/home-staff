# OTP Email Setup Instructions

## Overview

The `send-otp` Edge Function has been updated to use SMTP for sending emails instead of Resend. You need to configure SMTP settings in Supabase and set them as Edge Function secrets.

## Manual Steps Required

### Step 1: Configure SMTP in Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qmsedptrtwoxnvimabte
2. Navigate to **Authentication** → **Settings** → **SMTP Settings**
3. Configure your SMTP provider (Gmail, SendGrid, Mailgun, etc.)
   - **SMTP Host**: Your SMTP server hostname (e.g., `smtp.gmail.com`)
   - **SMTP Port**: Usually `587` for TLS or `465` for SSL
   - **SMTP User**: Your SMTP username/email
   - **SMTP Password**: Your SMTP password or app-specific password
   - **From Email**: The email address to send from (e.g., `noreply@yourdomain.com`)
   - **Sender Name**: Display name (e.g., `HomeStaff`)

### Step 2: Set Edge Function Secrets

After configuring SMTP in the dashboard, you need to set these as Edge Function secrets:

1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Add the following secrets:
   - `SMTP_HOST` - Your SMTP hostname
   - `SMTP_PORT` - Your SMTP port (usually `587`)
   - `SMTP_USER` - Your SMTP username
   - `SMTP_PASS` - Your SMTP password
   - `SMTP_FROM` - Your from email address (optional, defaults to `noreply@homestaff.app`)

### Step 3: Disable Email Confirmation

1. In Supabase Dashboard, go to **Authentication** → **Settings** → **Email Auth**
2. Toggle OFF **"Enable email confirmations"**
3. This prevents Supabase from sending automatic confirmation link emails

## Current Implementation

The Edge Function uses the `denomailer` library for SMTP. If deployment fails, you may need to:

1. Use a different SMTP library compatible with Supabase Edge Functions
2. Or implement a simpler SMTP client using native Deno APIs

## Testing

After configuration:
1. Register a new user
2. Check Edge Function logs to see if OTP email was sent
3. Verify OTP appears in `otp_codes` table
4. Check your email inbox for the OTP code

## Troubleshooting

- If emails aren't sending, check Edge Function logs in Supabase Dashboard
- Verify all SMTP secrets are set correctly
- Test SMTP credentials with a simple email client first
- Check that your SMTP provider allows connections from Supabase's IP ranges
