'use client'

import { useMemo } from 'react'
import { createClient } from '@/lib/supabase'

/**
 * Hook to get Supabase client for client-side operations
 * Usage: const supabase = useSupabase()
 */
export function useSupabase() {
  const supabase = useMemo(() => createClient(), [])
  return supabase
}
