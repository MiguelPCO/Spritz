"use client"

import { useState, useTransition, useRef, useMemo } from "react"
import { Search, X } from "lucide-react"
import { toast } from "sonner"
import { useWardrobe } from "@/lib/hooks/useWardrobe"
import { useQueryClient } from "@tanstack/react-query"
import { getFragranceName, getFragranceBrand } from "@/types/fragrance"
import { addToWardrobe } from "@/lib/actions/fragrance.actions"
import { queryKeys } from "@/lib/constants/queryKeys"
import type { FragranceCatalogResult } from "@/lib/api/parfumo"
import { CatalogFragranceCard } from "./CatalogFragranceCard"

export function ExternalSearch() {
  const { data: wardrobe = [] } = useWardrobe()
  const queryClient = useQueryClient()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<FragranceCatalogResult[]>([])
  const [searching, setSearching] = useState(false)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ownedKeys = useMemo(() => new Set(
    wardrobe.flatMap((uf) => {
      const keys: string[] = []
      if (uf.fragrance?.external_id) keys.push(uf.fragrance.external_id)
      keys.push(`${getFragranceName(uf).toLowerCase()}|${getFragranceBrand(uf).toLowerCase()}`)
      return keys
    })
  ), [wardrobe])

  function isOwned(r: FragranceCatalogResult): boolean {
    if (ownedKeys.has(r.id)) return true
    return ownedKeys.has(`${r.name.toLowerCase()}|${r.brand.toLowerCase()}`)
  }

  function handleChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/fragrance-search?q=${encodeURIComponent(value)}`)
        setResults(await res.json())
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  function handleAdd(result: FragranceCatalogResult) {
    startTransition(async () => {
      try {
        await addToWardrobe({ catalogResult: result, status: "wishlist" })
        queryClient.invalidateQueries({ queryKey: queryKeys.wardrobe.all })
        toast.success(`${result.name} añadida a lista de deseos`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al añadir")
      }
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Explorar fragancias
      </p>
      <div
        className="flex items-center gap-2 rounded-[12px] px-3 py-2.5"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <Search size={15} style={{ color: "var(--text-muted)" }} />
        <input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Buscar por nombre, marca o familia..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]) }}>
            <X size={14} style={{ color: "var(--text-muted)" }} />
          </button>
        )}
      </div>

      {searching && (
        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>Buscando...</p>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r) => (
            <CatalogFragranceCard
              key={r.id}
              result={r}
              onAdd={handleAdd}
              isAdding={isPending}
              isOwned={isOwned(r)}
            />
          ))}
        </div>
      )}

      {!searching && query.trim() && results.length === 0 && (
        <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
          Sin resultados para &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  )
}
