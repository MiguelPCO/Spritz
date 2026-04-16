"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { queryKeys } from "@/lib/constants/queryKeys"
import type { UserFragrance } from "@/types/fragrance"
import { toast } from "sonner"

async function fetchWardrobe(): Promise<UserFragrance[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("user_fragrances")
    .select(`
      *,
      fragrance:fragrances (*)
    `)
    .order("date_added", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as UserFragrance[]
}

export function useWardrobe() {
  return useQuery({
    queryKey: queryKeys.wardrobe.list(),
    queryFn: fetchWardrobe,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useDeleteFragrance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userFragranceId: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from("user_fragrances")
        .delete()
        .eq("id", userFragranceId)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wardrobe.all })
      toast.success("Fragancia eliminada")
    },
    onError: (err) => {
      toast.error("Error al eliminar", { description: err.message })
    },
  })
}
