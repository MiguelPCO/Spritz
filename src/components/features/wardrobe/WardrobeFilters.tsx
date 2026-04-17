"use client"

import { Search, X } from "lucide-react"
import { SCENT_FAMILIES } from "@/lib/constants/scentFamilies"
import type { ScentFamily } from "@/lib/constants/scentFamilies"
import { useWardrobeStore, type SortBy } from "@/lib/stores/wardrobeStore"

const SORT_OPTIONS: Array<{ id: SortBy; label: string }> = [
  { id: "date_added", label: "Recientes" },
  { id: "name", label: "Nombre" },
  { id: "brand", label: "Marca" },
]

export function WardrobeFilters() {
  const { searchQuery, setSearchQuery, activeFilter, setActiveFilter, sortBy, setSortBy } =
    useWardrobeStore()

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative mx-5">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="search"
          placeholder="Buscar fragancia…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 w-full rounded-[12px] border pl-10 pr-4 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X size={14} style={{ color: "var(--text-muted)" }} />
          </button>
        )}
      </div>

      {/* Family filter pills — horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none">
        {/* All */}
        <button
          onClick={() => setActiveFilter(null)}
          className="shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
          style={{
            backgroundColor: activeFilter === null ? "var(--text-primary)" : "var(--bg-surface)",
            color: activeFilter === null ? "white" : "var(--text-secondary)",
          }}
        >
          Todas
        </button>

        {SCENT_FAMILIES.map((family) => (
          <button
            key={family.id}
            onClick={() =>
              setActiveFilter(activeFilter === family.id ? null : family.id as ScentFamily)
            }
            className="shrink-0 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              backgroundColor:
                activeFilter === family.id ? family.color : "var(--bg-surface)",
              color:
                activeFilter === family.id ? "white" : "var(--text-secondary)",
            }}
          >
            <span>{family.emoji}</span>
            <span>{family.labelEs}</span>
          </button>
        ))}
      </div>

      {/* Sort chips */}
      <div className="flex items-center gap-2 px-5 pb-1">
        <span className="text-[11px] uppercase tracking-widest shrink-0" style={{ color: "var(--text-muted)" }}>
          Orden
        </span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSortBy(opt.id)}
            className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
            style={{
              backgroundColor: sortBy === opt.id ? "var(--scent-accent)" : "var(--bg-surface)",
              color: sortBy === opt.id ? "white" : "var(--text-secondary)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
