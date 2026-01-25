import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Missing environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const { email, purpose } = await req.json()

    if (!email || !purpose) {
      return new Response(
        JSON.stringify({ error: 'Email and purpose are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!['email_verification', 'password_reset'].includes(purpose)) {
      return new Response(
        JSON.stringify({ error: 'Invalid purpose. Must be email_verification or password_reset' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check rate limiting - max 3 OTP requests per email per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: recentOtps, error: rateLimitError } = await supabase
      .from('otp_codes')
      .select('id')
      .eq('email', email)
      .eq('purpose', purpose)
      .gte('created_at', oneHourAgo)
      .eq('used', false)

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError)
      return new Response(
        JSON.stringify({ error: 'Failed to check rate limit' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (recentOtps && recentOtps.length >= 3) {
      return new Response(
        JSON.stringify({ error: 'Too many OTP requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Invalidate any existing unused OTPs for this email and purpose
    await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('email', email)
      .eq('purpose', purpose)
      .eq('used', false)

    // Store OTP in database
    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({
        email,
        code,
        purpose,
        expires_at: expiresAt,
        used: false,
        attempts: 0,
      })

    if (insertError) {
      console.error('OTP insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send OTP via email using Resend API
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev'
    
    const emailSubject = purpose === 'email_verification' 
      ? 'Verify your email address - HomeStaff'
      : 'Reset your password - HomeStaff'
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${purpose === 'email_verification' ? 'Verify Your Email Address' : 'Reset Your Password'}</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `
    
    const emailText = `
${purpose === 'email_verification' ? 'Verify Your Email Address' : 'Reset Your Password'}

Your verification code is: ${code}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.
    `.trim()

    // Send email via Resend API
    if (RESEND_API_KEY) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [email],
            subject: emailSubject,
            html: emailHtml,
            text: emailText,
          }),
        })

        const resendData = await resendResponse.json()

        if (!resendResponse.ok) {
          console.error('Resend API error:', resendData)
          // Log OTP for debugging if email fails
          console.log(`OTP for ${email} (${purpose}): ${code}`)
          return new Response(
            JSON.stringify({ error: 'Failed to send email. Please try again.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log(`OTP email sent successfully to ${email}`)
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Log OTP for debugging if email fails
        console.log(`OTP for ${email} (${purpose}): ${code}`)
        return new Response(
          JSON.stringify({ error: 'Failed to send email. Please try again.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else {
      // Fallback: Log OTP if Resend API key is not configured
      console.log(`RESEND_API_KEY not configured. OTP for ${email} (${purpose}): ${code}`)
      console.warn('Email sending is disabled. Configure RESEND_API_KEY to enable email sending.')
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'OTP sent successfully',
        // In development, include code for testing (remove in production)
        ...(Deno.env.get('ENVIRONMENT') === 'development' && { code })
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Send OTP error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})