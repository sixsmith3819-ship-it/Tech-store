import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for server-side operations.
 * This should be used in API routes and server actions.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions)
            })
          } catch {
            // Handle errors setting cookies
          }
        },
      },
    }
  )
}

/**
 * Creates a Supabase client with service role key for privileged operations.
 * WARNING: This bypasses RLS policies. Use with extreme caution!
 * Only use on the server side for admin operations that require elevated privileges.
 */
export function createServiceRoleClient() {
  const { createClient } = require('@supabase/supabase-js')
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables')
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

/**
 * Get the current user from session
 */
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  return user
}

/**
 * Get current user's profile with role information
 */
export async function getCurrentUserProfile() {
  const supabase = await createServerSupabaseClient()
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin() {
  const profile = await getCurrentUserProfile()
  return profile?.role === 'admin'
}

/**
 * Verify admin access for API routes
 */
export async function requireAdmin() {
  const adminStatus = await isAdmin()
  if (!adminStatus) {
    throw new Error('Unauthorized: Admin access required')
  }
}
