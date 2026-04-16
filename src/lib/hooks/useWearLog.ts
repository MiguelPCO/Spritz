"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { queryKeys } from "@/lib/constants/queryKeys"
import { startOfMonth, endOfMonth, format } from "date-fns"
import type { WearLog } from "@/types/recommendation"

async function fetchWearLogForMonth(
  year: number,
  month: number
): Promise<WearLog[]> {
  const supabase = createClient()
  const start = format(startOfMonth(new Date(year, month)), "yyyy-MM-dd")
  const end = format(endOfMonth(new Date(year, month)), "yyyy-MM-dd")

  const { data, error } = await supabase
    .from("wear_logs")
    .select(`
      *,
      user_fragrance:user_fragrances (
        *,
        fragrance:fragrances (*)
      )
    `)
    .gte("worn_at", start)
    .lte("worn_at", end + "T23:59:59")
    .order("worn_at", { ascending: false })

  if (error) return []
  return (data ?? []) as unknown as WearLog[]
}

export function useWearLog(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.wearLog.byMonth(year, month),
    queryFn: () => fetchWearLogForMonth(year, month),
    staleTime: 5 * 60 * 1000,
  })
}

async function fetchRecentWears(): Promise<WearLog[]> {
  const supabase = createClient()
  const since = new Date()
  since.setDate(since.getDate() - 7)

  const { data, error } = await supabase
    .from("wear_logs")
    .select(`
      *,
      user_fragrance:user_fragrances (
        *,
        fragrance:fragrances (*)
      )
    `)
    .gte("worn_at", since.toISOString())
    .order("worn_at", { ascending: false })
    .limit(10)

  if (error) return []
  return (data ?? []) as unknown as WearLog[]
}

export function useRecentWears() {
  return useQuery({
    queryKey: queryKeys.wearLog.recent(),
    queryFn: fetchRecentWears,
    staleTime: 5 * 60 * 1000,
  })
}
