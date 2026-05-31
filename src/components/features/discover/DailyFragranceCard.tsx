"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useWardrobe } from "@/lib/hooks/useWardrobe"
import { useLastWornDates } from "@/lib/hooks/useWearLog"
import { getFragranceName, getFragranceBrand, getFragranceFamily, getFragranceImageUrl } from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"
import { getCurrentSeason } from "@/lib/utils/seasonUtils"
import { Skeleton } from "@/components/ui/skeleton"

const SEASON_LABELS: Record<string, string> = {
  spring: "Primavera",
  summer: "Verano",
  autumn: "Otoño",
  winter: "Invierno",
}

export function DailyFragranceCard() {
  const { data: wardrobe = [], isLoading: wardrobeLoading } = useWardrobe()
  const { data: lastWornDates = {}, isLoading: wornLoading } = useLastWornDates()

  const pick = useMemo(() => {
    const actives = wardrobe.filter((uf) => uf.status === "active")
    if (actives.length === 0) return null

    const season = getCurrentSeason()
    const now = Date.now()

    const scored = actives.map((uf) => {
      let score = 0
      if (uf.season_tags.includes(season)) score += 3
      const lastWorn = lastWornDates[uf.id]
      if (!lastWorn) {
        score += 3
      } else {
        const days = (now - new Date(lastWorn).getTime()) / (1000 * 60 * 60 * 24)
        if (days > 7)  score += 2
        if (days > 14) score += 1
      }
      return { uf, score }
    })

    scored.sort((a, b) =>
      b.score - a.score || a.uf.date_added.localeCompare(b.uf.date_added)
    )
    return scored[0]?.uf ?? null
  }, [wardrobe, lastWornDates])

  if (wardrobeLoading || wornLoading) {
    return <Skeleton className="h-20 w-full rounded-[16px]" />
  }

  if (!pick) return null

  const family = getFragranceFamily(pick)
  const familyDef = getScentFamily(family)
  const season = getCurrentSeason()
  const imageUrl = getFragranceImageUrl(pick)

  return (
    <Link href={`/wardrobe/${pick.id}`}>
      <div
        data-scent={family}
        className="flex items-center gap-4 rounded-[16px] p-4"
        style={{
          backgroundColor: "var(--scent-accent-light)",
          border: "1px solid color-mix(in srgb, var(--scent-accent) 20%, transparent)",
        }}
      >
        <div
          className="shrink-0 flex h-14 w-14 items-center justify-center rounded-[12px] overflow-hidden"
          style={{ backgroundColor: "color-mix(in srgb, var(--scent-accent) 15%, transparent)" }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={getFragranceName(pick)}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-3xl select-none">{familyDef.emoji}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] font-medium uppercase tracking-widest mb-0.5"
            style={{ color: "var(--scent-accent)" }}
          >
            Fragancia del día · {SEASON_LABELS[season]}
          </p>
          <p
            className="text-sm font-semibold truncate"
            style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
          >
            {getFragranceName(pick)}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
            {getFragranceBrand(pick)} · {familyDef.labelEs}
          </p>
        </div>
      </div>
    </Link>
  )
}
