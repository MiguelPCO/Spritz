"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { queryKeys } from "@/lib/constants/queryKeys"
import type { UserFragrance } from "@/types/fragrance"
import type { WearLog } from "@/types/recommendation"

async function fetchFragrance(id: string): Promise<UserFragrance | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("user_fragrances")
    .select("*, fragrance:fragrances(*)")
    .eq("id", id)
    .single()

  if (error) return null
  return data as unknown as UserFragrance
}

async function fetchFragranceWearHistory(
  userFragranceId: string
): Promise<WearLog[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("wear_logs")
    .select("*")
    .eq("user_fragrance_id", userFragranceId)
    .order("worn_at", { ascending: false })
    .limit(20)

  if (error) return []
  return (data ?? []) as unknown as WearLog[]
}

export function useFragrance(id: string) {
  return useQuery({
    queryKey: queryKeys.wardrobe.detail(id),
    queryFn: () => fetchFragrance(id),
    enabled: Boolean(id),
  })
}

export function useFragranceWearHistory(userFragranceId: string) {
  return useQuery({
    queryKey: queryKeys.wearLog.byFragrance(userFragranceId),
    queryFn: () => fetchFragranceWearHistory(userFragranceId),
    enabled: Boolean(userFragranceId),
  })
}
