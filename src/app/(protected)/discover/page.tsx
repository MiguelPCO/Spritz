"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
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
        <div className="mb-4">
          <DailyFragranceCard />
        </div>

        {/* Progress card — shown when collection has < 3 active fragrances */}
        {!isLoading && total < 3 && (
          <div
            className="rounded-[20px] p-5"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
              Perfil olfativo
            </p>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              {total === 0
                ? "Añade tus primeras fragancias"
                : `Añade ${3 - total} fragancia${3 - total !== 1 ? "s" : ""} más`}
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Necesitas 3 fragancias activas para ver tu perfil olfativo.
            </p>
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
                <span>{total} de 3 fragancias</span>
                <span>{Math.round((total / 3) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: "var(--border-subtle)" }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.round((total / 3) * 100)}%`,
                    backgroundColor: "var(--scent-accent)",
                  }}
                />
              </div>
            </div>
            <Link
              href="/add"
              className="flex w-full items-center justify-center gap-2 rounded-[12px] py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--scent-accent)" }}
            >
              <Plus size={15} />
              Añadir fragancia
            </Link>
          </div>
        )}

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
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Lista de deseos
          </p>
          {wishlist.length > 0 ? (
            <WishlistSortable wishlist={wishlist} />
          ) : (
            <div
              className="rounded-[16px] py-8 text-center"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              <p className="text-2xl mb-2">✨</p>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                Tu lista de deseos está vacía
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Busca fragancias arriba y añádelas aquí
              </p>
            </div>
          )}
        </div>


      </div>
    </div>
  )
}
