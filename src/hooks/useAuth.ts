'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from './useSupabase'
import type { UserProfile } from '@/types/database'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: 'customer' | 'admin'
  phone?: string
  address?: string
}

interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

/**
 * Hook to manage authentication state
 * Usage: const { user, isLoading, logout } = useAuth()
 */
export function useAuth(): UseAuthReturn {
  const supabase = useSupabase()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch current user on mount and when auth state changes
  const fetchUser = async () => {
    try {
      setIsLoading(true)
      
      // Get auth user
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        setUser(null)
        return
      }

      // Get user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error || !profile) {
        console.error('Error fetching profile:', error)
        setUser(null)
        return
      }

      setUser({
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role,
        phone: profile.phone,
        address: profile.address,
      })
    } catch (error) {
      console.error('Error in fetchUser:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      fetchUser()
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error logging out:', error)
      throw error
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    logout,
    refetch: fetchUser,
  }
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const auth = useAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.isAuthenticated) {
        // Redirect will happen in protected component
      }
      setIsReady(true)
    }
  }, [auth.isLoading, auth.isAuthenticated])

  return { ...auth, isReady }
}

/**
 * Hook to require admin access
 */
export function useRequireAdmin() {
  const auth = useAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.isAdmin) {
        // Redirect will happen in protected component
      }
      setIsReady(true)
    }
  }, [auth.isLoading, auth.isAdmin])

  return { ...auth, isReady }
}
