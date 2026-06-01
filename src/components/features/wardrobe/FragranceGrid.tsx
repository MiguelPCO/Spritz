"use client"

import { FragranceCard } from "./FragranceCard"
import { useWardrobeStore } from "@/lib/stores/wardrobeStore"
import type { UserFragrance } from "@/types/fragrance"
import { getFragranceName, getFragranceBrand, getFragranceFamilies } from "@/types/fragrance"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Plus } from "lucide-react"

interface FragranceGridProps {
  fragrances: UserFragrance[]
  isLoading: boolean
  lastWornDates?: Record<string, string>
}

export function FragranceGrid({ fragrances, isLoading, lastWornDates }: FragranceGridProps) {
  const { viewMode, activeFilter, searchQuery, sortBy } = useWardrobeStore()

  const filtered = fragrances.filter((uf) => {
    if (activeFilter && !getFragranceFamilies(uf).includes(activeFilter)) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        getFragranceName(uf).toLowerCase().includes(q) ||
        getFragranceBrand(uf).toLowerCase().includes(q)
      )
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return getFragranceName(a).localeCompare(getFragranceName(b), "es")
    if (sortBy === "brand") return getFragranceBrand(a).localeCompare(getFragranceBrand(b), "es")
    return 0 // "date_added" — Supabase returns newest first already
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 px-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[180px] rounded-[16px]" />
        ))}
      </div>
    )
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <p className="text-2xl mb-2">🫙</p>
        <p className="font-semibold mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
          {fragrances.length === 0
            ? "Tu colección está vacía"
            : "Sin resultados"}
        </p>
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          {fragrances.length === 0
            ? "Añade tu primera fragancia"
            : "Prueba con otro filtro o búsqueda"}
        </p>
        {fragrances.length === 0 && (
          <Link
            href="/add"
            className="flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--scent-accent)" }}
          >
            <Plus size={16} />
            Añadir fragancia
          </Link>
        )}
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-2 px-5">
        {sorted.map((uf, index) => (
          <div
            key={uf.id}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
          >
            <FragranceCard
              userFragrance={uf}
              variant="full"
              lastWornAt={lastWornDates?.[uf.id]}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      {sorted.map((uf, index) => (
        <div
          key={uf.id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
        >
          <FragranceCard
            userFragrance={uf}
            variant="compact"
            lastWornAt={lastWornDates?.[uf.id]}
          />
        </div>
      ))}

      {/* CTA card when collection has a single item — fills the empty grid cell */}
      {sorted.length === 1 && (
        <Link
          href="/add"
          className="flex flex-col items-center justify-center gap-2 rounded-[16px] p-3 border-2 border-dashed transition-opacity hover:opacity-70"
          style={{ borderColor: "var(--border-subtle)", minHeight: "180px" }}
        >
          <Plus size={24} style={{ color: "var(--text-muted)" }} />
          <span className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Añade tu próxima fragancia
          </span>
        </Link>
      )}
    </div>
  )
}
