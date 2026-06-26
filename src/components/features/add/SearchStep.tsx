"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Search, Loader2, PenLine, Droplets, Sparkles } from "lucide-react"
import type { FragranceCatalogResult } from "@/lib/api/parfumo"
import { useAddFragranceStore } from "@/lib/stores/addFragranceStore"
import { getScentFamily } from "@/lib/constants/scentFamilies"

type SearchSource = "seed" | "ai" | "empty" | null

export function SearchStep() {
  const { setStep, updateDraft } = useAddFragranceStore()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<FragranceCatalogResult[]>([])
  const [source, setSource] = useState<SearchSource>(null)
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastQuery = useRef("")

  async function doSearch(q: string) {
    const trimmed = q.trim()
    if (!trimmed || trimmed === lastQuery.current) return
    lastQuery.current = trimmed
    setSearching(true)
    try {
      const res = await fetch(`/api/fragrance-search?q=${encodeURIComponent(trimmed)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as { results: FragranceCatalogResult[]; source: SearchSource }
      setResults(data.results ?? [])
      setSource(data.source ?? "empty")
    } catch {
      setResults([])
      setSource("empty")
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSource(null)
      lastQuery.current = ""
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(query), 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  function handleSelect(result: FragranceCatalogResult) {
    updateDraft({
      catalogResult: result,
      name: result.name,
      brand: result.brand,
      topNotes: result.topNotes,
      middleNotes: result.middleNotes,
      baseNotes: result.baseNotes,
    })
    setStep("tags")
  }

  const hasQuery = query.trim().length > 0
  const showEmpty = hasQuery && !searching && source !== null && results.length === 0

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
        >
          Busca tu fragancia
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Escribe el nombre o la marca
        </p>
      </div>

      {/* Search input — debounce auto-search */}
      <div className="relative">
        <input
          type="search"
          placeholder="Ej. Bleu de Chanel"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 w-full rounded-[12px] border pl-4 pr-10 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {searching
            ? <Loader2 size={16} className="animate-spin" style={{ color: "var(--text-muted)" }} />
            : <Search size={16} style={{ color: "var(--text-muted)" }} />
          }
        </div>
      </div>

      {/* AI fallback badge */}
      {source === "ai" && results.length > 0 && (
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium w-fit"
          style={{ backgroundColor: "var(--scent-accent-light)", color: "var(--scent-accent)" }}
        >
          <Sparkles size={12} />
          Resultados ampliados con IA
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r) => {
            const familyDef = getScentFamily(r.family)
            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="flex w-full items-center gap-3 rounded-[12px] p-3 text-left transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                {/* Thumbnail */}
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px]"
                  style={{ backgroundColor: familyDef.colorLight }}
                >
                  {r.imageUrl ? (
                    <Image
                      src={r.imageUrl}
                      alt={r.name}
                      width={48}
                      height={48}
                      className="h-full w-full rounded-[10px] object-cover"
                    />
                  ) : (
                    <Droplets size={20} style={{ color: familyDef.color }} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {r.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {r.brand}{r.year ? ` · ${r.year}` : ""}
                  </p>
                </div>

                {/* Family pill */}
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{ backgroundColor: familyDef.colorLight, color: familyDef.colorDark }}
                >
                  {familyDef.emoji}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {showEmpty && (
        <p className="text-sm text-center py-2" style={{ color: "var(--text-muted)" }}>
          Sin resultados. ¿Quieres añadirla manualmente?
        </p>
      )}

      {/* Manual entry */}
      <button
        onClick={() => setStep("manual")}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] py-3 text-sm font-medium transition-colors"
        style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
      >
        <PenLine size={16} />
        Entrada manual
      </button>
    </div>
  )
}
