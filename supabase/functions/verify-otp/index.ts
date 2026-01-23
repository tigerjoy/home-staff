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
    const { email, code, purpose } = await req.json()

    if (!email || !code || !purpose) {
      return new Response(
        JSON.stringify({ error: 'Email, code, and purpose are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!['email_verification', 'password_reset'].includes(purpose)) {
      return new Response(
        JSON.stringify({ error: 'Invalid purpose. Must be email_verification or password_reset' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find the OTP code
    const { data: otpData, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('purpose', purpose)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !otpData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired verification code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if OTP is expired
    const now = new Date()
    const expiresAt = new Date(otpData.expires_at)
    
    if (now > expiresAt) {
      // Mark as used to prevent reuse
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otpData.id)

      return new Response(
        JSON.stringify({ error: 'Verification code has expired. Please request a new one.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if too many attempts (max 5 attempts)
    if (otpData.attempts >= 5) {
      // Mark as used to prevent further attempts
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otpData.id)

      return new Response(
        JSON.stringify({ error: 'Too many verification attempts. Please request a new code.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the code
    if (otpData.code !== code) {
      // Increment attempts
      await supabase
        .from('otp_codes')
        .update({ attempts: otpData.attempts + 1 })
        .eq('id', otpData.id)

      const remainingAttempts = 5 - (otpData.attempts + 1)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid verification code',
          remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Code is valid - mark as used
    await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('id', otpData.id)

    // For email verification, update user's email confirmation status
    if (purpose === 'email_verification') {
      // Get user by email
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers()
      
      if (!userError && userData) {
        const user = userData.users.find(u => u.email === email)
        if (user && !user.email_confirmed_at) {
          // Confirm email
          await supabase.auth.admin.updateUserById(user.id, {
            email_confirm: true
          })
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Code verified successfully',
        verified: true
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Verify OTP error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
