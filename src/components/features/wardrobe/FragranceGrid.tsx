"use client"

import { FragranceCard } from "./FragranceCard"
import { useWardrobeStore } from "@/lib/stores/wardrobeStore"
import type { UserFragrance } from "@/types/fragrance"
import { getFragranceName, getFragranceBrand, getFragranceFamily } from "@/types/fragrance"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Plus } from "lucide-react"

interface FragranceGridProps {
  fragrances: UserFragrance[]
  isLoading: boolean
}

export function FragranceGrid({ fragrances, isLoading }: FragranceGridProps) {
  const { viewMode, activeFilter, searchQuery } = useWardrobeStore()

  // Apply filters
  const filtered = fragrances.filter((uf) => {
    if (activeFilter && getFragranceFamily(uf) !== activeFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        getFragranceName(uf).toLowerCase().includes(q) ||
        getFragranceBrand(uf).toLowerCase().includes(q)
      )
    }
    return true
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

  if (filtered.length === 0) {
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
        {filtered.map((uf) => (
          <FragranceCard key={uf.id} userFragrance={uf} variant="full" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      {filtered.map((uf) => (
        <FragranceCard key={uf.id} userFragrance={uf} variant="compact" />
      ))}
    </div>
  )
}
