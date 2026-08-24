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

    // Use Supabase updateUser to reset password
    const { error } = await supabase.auth.updateUser(
      { password },
      { accessToken: token }
    )

    if (error) {
      console.error("Password reset error:", error)
      return NextResponse.json(
        { success: false, message: "Failed to reset password. Token may have expired." },
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
