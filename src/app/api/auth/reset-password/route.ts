import { createServerSupabaseClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

/**
 * POST /api/auth/reset-password
 * Reset user password using token from email
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Token and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // First verify the OTP token
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "recovery",
    })

    if (verifyError || !verifyData.user) {
      console.error("OTP verification error:", verifyError)
      return NextResponse.json(
        { success: false, message: "Invalid or expired reset token." },
        { status: 400 }
      )
    }

    // Now update the password for the verified user
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      console.error("Password update error:", updateError)
      return NextResponse.json(
        { success: false, message: "Failed to reset password." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    )
  }
}
