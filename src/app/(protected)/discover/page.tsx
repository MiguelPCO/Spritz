"use client"

import { useMemo } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { useWardrobe } from "@/lib/hooks/useWardrobe"
import { getFragranceFamily } from "@/types/fragrance"
import { getScentFamily, SCENT_FAMILIES } from "@/lib/constants/scentFamilies"
import { DailyFragranceCard } from "@/components/features/discover/DailyFragranceCard"
import { CrossRecommendations } from "@/components/features/discover/CrossRecommendations"
import { ExternalSearch } from "@/components/features/discover/ExternalSearch"
import { WishlistSortable } from "@/components/features/discover/WishlistSortable"

export default function DiscoverPage() {
  const { data: wardrobe = [], isLoading } = useWardrobe()

  const wishlist = wardrobe.filter((uf) => uf.status === "wishlist")
  const activeFragrances = wardrobe.filter((uf) => uf.status === "active")

  const { familyCounts, dominantFamily } = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const uf of activeFragrances) {
      const f = getFragranceFamily(uf)
      counts[f] = (counts[f] ?? 0) + 1
    }
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    return { familyCounts: counts, dominantFamily: dominant }
  }, [activeFragrances])

  const dominantDef = dominantFamily ? getScentFamily(dominantFamily) : null
  const total = activeFragrances.length

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <TopBar title="Descubrir" />

      <div className="space-y-6 px-5 pb-8 pt-2">

        {/* Daily pick */}
        <DailyFragranceCard />

        {/* DNA profile */}
        {dominantDef && total >= 3 && (
          <div
            data-scent={dominantDef.id}
            className="animate-spray-in rounded-[20px] p-5"
            style={{
              backgroundColor: "var(--scent-accent-light)",
              border: "1px solid color-mix(in srgb, var(--scent-accent) 20%, transparent)",
            }}
          >
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--scent-accent)" }}>
              Tu perfil olfativo
            </p>
            <p
              className="text-2xl font-light mb-1"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
            >
              {dominantDef.emoji} Colección {dominantDef.labelEs}
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              {Math.round((familyCounts[dominantFamily!] / total) * 100)}% de tu colección
            </p>
            <div className="space-y-2">
              {SCENT_FAMILIES
                .filter((f) => familyCounts[f.id])
                .sort((a, b) => (familyCounts[b.id] ?? 0) - (familyCounts[a.id] ?? 0))
                .map((f) => {
                  const pct = Math.round(((familyCounts[f.id] ?? 0) / total) * 100)
                  return (
                    <div key={f.id} className="flex items-center gap-2">
                      <span className="w-20 text-[11px] shrink-0" style={{ color: "var(--text-secondary)" }}>
                        {f.emoji} {f.labelEs}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "rgba(45,41,38,0.1)" }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: f.color }} />
                      </div>
                      <span className="text-[11px] w-8 text-right shrink-0" style={{ color: "var(--text-muted)" }}>
                        {pct}%
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Cross-recommendations */}
        <CrossRecommendations />

        {/* External fragrance search */}
        <ExternalSearch />

        {/* Wishlist */}
        {wishlist.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Lista de deseos
            </p>
            <WishlistSortable wishlist={wishlist} />
          </div>
        )}

        {!isLoading && total < 3 && wishlist.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🔭</p>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Añade más fragancias
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Necesitas al menos 3 para ver tu perfil olfativo.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
