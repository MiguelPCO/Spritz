"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/constants/queryKeys"
import type { AIPromptContext, AIRecommendationResponse } from "@/types/recommendation"

async function fetchRecommendation(
  ctx: AIPromptContext
): Promise<AIRecommendationResponse> {
  // wardrobe is fetched server-side — omit it from the request body
  const { wardrobe: _wardrobe, ...payload } = ctx
  const res = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? "Error generando recomendación")
  }

  return res.json()
}

export function useRecommendation(ctx: AIPromptContext | null, enabled: boolean = false) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.recommendation.current(),
    queryFn: () => fetchRecommendation(ctx!),
    enabled: enabled && ctx !== null && ctx.wardrobe.length > 0,
    staleTime: 0, // Always fresh — user can tap "Otra opción"
    retry: 1,
  })

  function refresh() {
    queryClient.invalidateQueries({ queryKey: queryKeys.recommendation.current() })
  }

  return { ...query, refresh }
}
