import { createServerSupabaseClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

/**
 * POST /api/auth/forgot-password
 * Send password reset email to user
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const resetUrl = appUrl + "/auth/reset-password"
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    })

    if (error) {
      console.error("Password reset error:", error)
      return NextResponse.json(
        { success: false, message: "Failed to send reset email." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Check your email for password reset link." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    )
  }
}
