import { createServiceRoleClient, createServerSupabaseClient } from './supabase-server'

/**
 * Create a user profile after successful auth signup
 * Uses service role to bypass RLS policies
 */
export async function createUserProfile(
  userId: string,
  email: string,
  fullName: string,
  role: 'customer' | 'admin' = 'customer'
) {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        email,
        full_name: fullName,
        role,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating user profile:', error)
    throw error
  }

  return data
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    console.error('Error fetching user:', error)
    throw error
  }

  return data || null
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    full_name?: string
    phone?: string
    address?: string
  }
) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }

  return data
}

/**
 * Get user profile with role
 */
export async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    throw error
  }

  return data
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const profile = await getUserProfile(userId)
    return profile?.role === 'admin'
  } catch {
    return false
  }
}

/**
 * Verify email change
 */
export async function updateUserEmail(userId: string, newEmail: string) {
  const supabase = await createServerSupabaseClient()

  // Update auth email
  const { error: authError } = await supabase.auth.updateUser({
    email: newEmail,
  })

  if (authError) {
    console.error('Error updating auth email:', authError)
    throw authError
  }

  // Update profile email
  const { data, error } = await supabase
    .from('profiles')
    .update({ email: newEmail })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile email:', error)
    throw error
  }

  return data
}

/**
 * Change password
 */
export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    console.error('Error changing password:', error)
    throw error
  }

  return true
}
