"use client"

import { useState, useEffect, useTransition, useMemo } from "react"
import { toast } from "sonner"
import { useWardrobe } from "@/lib/hooks/useWardrobe"
import { useQueryClient } from "@tanstack/react-query"
import { getFragranceFamily, getFragranceName, getFragranceBrand } from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"
import { addToWardrobe } from "@/lib/actions/fragrance.actions"
import { queryKeys } from "@/lib/constants/queryKeys"
import type { FragranceCatalogResult } from "@/lib/api/parfumo"
import { Skeleton } from "@/components/ui/skeleton"

export function CrossRecommendations() {
  const { data: wardrobe = [] } = useWardrobe()
  const queryClient = useQueryClient()
  const [results, setResults] = useState<FragranceCatalogResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  const actives = wardrobe.filter((uf) => uf.status === "active")

  const dominantFamily = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const uf of actives) {
      const f = getFragranceFamily(uf)
      counts[f] = (counts[f] ?? 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
  }, [actives])

  const ownedKeys = useMemo(() => new Set(
    wardrobe.flatMap((uf) => {
      const keys: string[] = []
      if (uf.fragrance?.external_id) keys.push(uf.fragrance.external_id)
      keys.push(`${getFragranceName(uf).toLowerCase()}|${getFragranceBrand(uf).toLowerCase()}`)
      return keys
    })
  ), [wardrobe])

  useEffect(() => {
    if (!dominantFamily || actives.length < 3) return
    setLoading(true)
    fetch(`/api/fragrance-search?q=${encodeURIComponent(dominantFamily)}`)
      .then((r) => r.json())
      .then((data: FragranceCatalogResult[]) => {
        const filtered = data.filter((r) => {
          if (ownedKeys.has(r.id)) return false
          return !ownedKeys.has(`${r.name.toLowerCase()}|${r.brand.toLowerCase()}`)
        })
        setResults(filtered.slice(0, 3))
      })
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dominantFamily])

  if (!dominantFamily || actives.length < 3) return null

  const familyDef = getScentFamily(dominantFamily)

  function handleAdd(result: FragranceCatalogResult) {
    startTransition(async () => {
      try {
        await addToWardrobe({ catalogResult: result, status: "wishlist" })
        queryClient.invalidateQueries({ queryKey: queryKeys.wardrobe.all })
        toast.success(`${result.name} añadida a lista de deseos`)
        setResults((prev) => prev.filter((r) => r.id !== result.id))
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al añadir")
      }
    })
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full rounded-[12px]" />)}
      </div>
    )
  }

  if (results.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Te podría gustar · {familyDef.emoji} {familyDef.labelEs}
      </p>
      {results.map((r) => {
        const rFamily = getScentFamily(r.family)
        return (
          <div
            key={r.id}
            data-scent={r.family}
            className="flex items-center gap-3 rounded-[12px] px-4 py-3"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <span className="text-2xl select-none">{rFamily.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {r.name}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {r.brand} · {rFamily.labelEs}
              </p>
            </div>
            <button
              onClick={() => handleAdd(r)}
              disabled={isPending}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "var(--scent-accent-light)", color: "var(--scent-accent)" }}
            >
              + Deseos
            </button>
          </div>
        )
      })}
    </div>
  )
}
