"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { queryKeys } from "@/lib/constants/queryKeys"

export interface ProfileData {
  id: string
  display_name: string | null
  avatar_url: string | null
  email: string | undefined
}

async function fetchProfile(): Promise<ProfileData | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("id", user.id)
    .single()

  return {
    id: user.id,
    display_name: data?.display_name ?? null,
    avatar_url: data?.avatar_url ?? null,
    email: user.email,
  }
}

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.current(),
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  })
}
