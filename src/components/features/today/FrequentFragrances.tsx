"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { getScentFamily } from "@/lib/constants/scentFamilies"
import { getFragranceName, getFragranceBrand, getFragranceFamily, getFragranceImageUrl } from "@/types/fragrance"
import { logWear } from "@/lib/actions/wear.actions"
import type { UserFragrance } from "@/types/fragrance"

interface FrequentFragrancesProps {
  fragrances: Array<{ uf: UserFragrance; count: number }>
}

export function FrequentFragrances({ fragrances }: FrequentFragrancesProps) {
  const [wearing, setWearing] = useState<string | null>(null)

  if (fragrances.length === 0) return null

  async function handleWear(uf: UserFragrance) {
    if (wearing) return
    setWearing(uf.id)
    try {
      await logWear({
        userFragranceId: uf.id,
        occasion: null,
        mood: null,
        weather: null,
        aiRecommended: false,
      })
      toast.success(`¡${getFragranceName(uf)} registrado!`)
    } catch {
      toast.error("Error al registrar")
    } finally {
      setWearing(null)
    }
  }

  return (
    <div className="space-y-2 px-5">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        Tus favoritas esta semana
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1 pt-2 -mx-5 px-5">
        {fragrances.map(({ uf, count }) => {
          const family = getFragranceFamily(uf)
          const familyDef = getScentFamily(family)
          const imageUrl = getFragranceImageUrl(uf)
          const isWearing = wearing === uf.id

          return (
            <div
              key={uf.id}
              className="relative flex shrink-0 flex-col items-center gap-2 rounded-[16px] p-3 w-[100px]"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              {/* Count badge */}
              <span
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white z-10"
                style={{ backgroundColor: "var(--scent-accent)" }}
              >
                {count}
              </span>

              {/* Circle image or family emoji */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full overflow-hidden"
                style={{ backgroundColor: familyDef.colorLight }}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={getFragranceName(uf)}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl select-none">{familyDef.emoji}</span>
                )}
              </div>

              {/* Name */}
              <p
                className="text-center text-[11px] font-medium leading-tight line-clamp-2"
                style={{ color: "var(--text-primary)" }}
              >
                {getFragranceName(uf)}
              </p>
              <p className="text-[10px] leading-none" style={{ color: "var(--text-muted)" }}>
                {getFragranceBrand(uf)}
              </p>

              {/* Wear button */}
              <button
                onClick={() => handleWear(uf)}
                disabled={!!wearing}
                className="mt-1 w-full rounded-full py-1 text-[10px] font-semibold text-white transition-opacity disabled:opacity-50"
                style={{ backgroundColor: familyDef.color }}
              >
                {isWearing ? "…" : "Ponérmela"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
