import Image from "next/image"
import { SprayParticles } from "@/components/layout/SprayParticles"
import type { UserFragrance } from "@/types/fragrance"
import { getFragranceName, getFragranceBrand, getFragranceFamily, getFragranceImageUrl } from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"

interface RecommendationCardProps {
  userFragrance: UserFragrance
  reason: string
  weatherLabel?: string
}

export function RecommendationCard({
  userFragrance,
  reason,
  weatherLabel,
}: RecommendationCardProps) {
  const name = getFragranceName(userFragrance)
  const brand = getFragranceBrand(userFragrance)
  const family = getFragranceFamily(userFragrance)
  const imageUrl = getFragranceImageUrl(userFragrance)
  const familyDef = getScentFamily(family)
  const scentAttr = familyDef.id

  return (
    <div
      data-scent={scentAttr}
      className="animate-spray-in relative mx-5 overflow-hidden rounded-[20px] p-5"
      style={{
        backgroundColor: "var(--scent-accent-light)",
        boxShadow: "var(--shadow-glow), 0 4px 12px rgba(45,41,38,0.08)",
        border: "1px solid color-mix(in srgb, var(--scent-accent) 20%, transparent)",
      }}
    >
      {/* Background spray particles */}
      <SprayParticles intensity={0.6} />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--scent-accent)" }}>
            Hoy te recomiendo
          </p>
          {weatherLabel && (
            <span className="rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{ backgroundColor: "white", color: "var(--text-secondary)" }}>
              {weatherLabel}
            </span>
          )}
        </div>

        {/* Fragrance info */}
        <div className="mb-4 flex items-center gap-4">
          {/* Bottle avatar */}
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[18px]"
            style={{
              backgroundColor: imageUrl ? "transparent" : "var(--scent-accent)",
              boxShadow: "0 8px 20px rgba(45,41,38,0.12)",
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={96}
                height={96}
                className="h-full w-full rounded-[18px] object-cover"
              />
            ) : (
              <span className="text-4xl select-none">{familyDef.emoji}</span>
            )}
          </div>

          {/* Name + brand + family */}
          <div className="flex-1 min-w-0">
            <p
              className="text-2xl font-light leading-tight tracking-tight"
              style={{
                fontFamily: "var(--font-fraunces)",
                color: "var(--text-primary)",
              }}
            >
              {name}
            </p>
            <p className="mt-0.5 text-sm" style={{ color: "var(--text-secondary)" }}>
              {brand}
            </p>
            <span className={`scent-tag scent-tag-${scentAttr} mt-2 inline-block`}>
              {familyDef.emoji} {familyDef.labelEs}
            </span>
          </div>
        </div>

        {/* AI reason */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {reason}
        </p>
      </div>
    </div>
  )
}
