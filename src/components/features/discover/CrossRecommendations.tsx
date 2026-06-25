"use client"

import { useState, useEffect, useTransition, useMemo } from "react"
import { toast } from "sonner"
import { Search } from "lucide-react"
import { useWardrobe } from "@/lib/hooks/useWardrobe"
import { useQueryClient } from "@tanstack/react-query"
import { getFragranceFamily, getFragranceName, getFragranceBrand } from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"
import { addToWardrobe } from "@/lib/actions/fragrance.actions"
import { queryKeys } from "@/lib/constants/queryKeys"
import type { FragranceCatalogResult } from "@/lib/api/parfumo"
import { Skeleton } from "@/components/ui/skeleton"
import { CatalogFragranceCard } from "./CatalogFragranceCard"

export function CrossRecommendations() {
  const { data: wardrobe = [] } = useWardrobe()
  const queryClient = useQueryClient()
  const [results, setResults] = useState<FragranceCatalogResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState("")
  const [activeQuery, setActiveQuery] = useState<string | null>(null)

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

  const queryToFetch = activeQuery ?? dominantFamily

  useEffect(() => {
    if (!queryToFetch) return
    setLoading(true)
    fetch(`/api/fragrance-search?q=${encodeURIComponent(queryToFetch)}`)
      .then((r) => r.json())
      .then((data: { results: FragranceCatalogResult[] }) => {
        const filtered = (data.results ?? []).filter((r) => {
          if (ownedKeys.has(r.id)) return false
          return !ownedKeys.has(`${r.name.toLowerCase()}|${r.brand.toLowerCase()}`)
        })
        setResults(filtered.slice(0, 3))
      })
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryToFetch])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = inputValue.trim()
    setActiveQuery(trimmed || null)
    setResults([])
  }

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

  const familyDef = dominantFamily ? getScentFamily(dominantFamily) : null
  const label = activeQuery
    ? `Resultados · "${activeQuery}"`
    : familyDef
    ? `Te podría gustar · ${familyDef.emoji} ${familyDef.labelEs}`
    : null

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Recomienda un perfume amaderado…"
          className="h-10 w-full rounded-[12px] border pl-9 pr-4 text-sm outline-none transition-colors"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        />
      </form>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full rounded-[12px]" />)}
        </div>
      )}

      {!loading && label && results.length > 0 && (
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      )}

      {!loading && results.map((r) => (
        <CatalogFragranceCard
          key={r.id}
          result={r}
          onAdd={handleAdd}
          isAdding={isPending}
        />
      ))}

      {!loading && results.length === 0 && queryToFetch && (
        <p className="text-xs text-center py-3" style={{ color: "var(--text-muted)" }}>
          Sin resultados para esta búsqueda
        </p>
      )}
    </div>
  )
}
