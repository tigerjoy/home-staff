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

    // Send OTP via email
    // Note: In production, you would use a proper email service
    // For now, we'll use Supabase's built-in email or you can integrate with SendGrid, Resend, etc.
    // This is a placeholder - you'll need to configure email sending based on your setup
    const emailSubject = purpose === 'email_verification' 
      ? 'Verify your email address'
      : 'Reset your password'
    
    const emailBody = `
      Your verification code is: ${code}
      
      This code will expire in 10 minutes.
      
      If you didn't request this code, please ignore this email.
    `

    // For development/testing, log the OTP
    // In production, remove this and use actual email sending
    console.log(`OTP for ${email} (${purpose}): ${code}`)

    // TODO: Integrate with email service (Supabase email, SendGrid, Resend, etc.)
    // For now, we'll return success - you can add email sending logic here
    // Example with Supabase email (if configured):
    // const { error: emailError } = await supabase.auth.admin.generateLink({
    //   type: 'magiclink',
    //   email: email,
    // })

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
