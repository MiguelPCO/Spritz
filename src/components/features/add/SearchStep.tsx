"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Loader2, PenLine, Droplets } from "lucide-react"
import { searchFragrances, type FragranceCatalogResult } from "@/lib/api/parfumo"
import { useAddFragranceStore } from "@/lib/stores/addFragranceStore"
import { getScentFamily } from "@/lib/constants/scentFamilies"

export function SearchStep() {
  const { setStep, updateDraft } = useAddFragranceStore()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<FragranceCatalogResult[]>([])
  const [searching, setSearching] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    const found = await searchFragrances(query)
    setResults(found)
    setSearching(false)
  }

  function handleSelect(result: FragranceCatalogResult) {
    updateDraft({
      catalogResult: result,
      name: result.name,
      brand: result.brand,
      family: result.family as Parameters<typeof updateDraft>[0]["family"],
      topNotes: result.topNotes,
      middleNotes: result.middleNotes,
      baseNotes: result.baseNotes,
    })
    setStep("tags")
  }

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

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="search"
          placeholder="Ej. Bleu de Chanel"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 flex-1 rounded-[12px] border px-4 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        />
        <button
          type="submit"
          disabled={searching}
          className="flex h-11 w-11 items-center justify-center rounded-[12px] text-white"
          style={{ backgroundColor: "var(--scent-accent)" }}
        >
          {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </button>
      </form>

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

      {results.length === 0 && query && !searching && (
        <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
          Sin resultados. ¿Quieres añadirla manualmente?
        </p>
      )}

      {/* Manual entry option */}
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
