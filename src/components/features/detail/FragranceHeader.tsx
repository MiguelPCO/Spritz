import Image from "next/image"
import { Droplets } from "lucide-react"
import type { UserFragrance } from "@/types/fragrance"
import {
  getFragranceName,
  getFragranceBrand,
  getFragranceFamily,
  getFragranceImageUrl,
} from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"

interface FragranceHeaderProps {
  userFragrance: UserFragrance
}

export function FragranceHeader({ userFragrance: uf }: FragranceHeaderProps) {
  const name = getFragranceName(uf)
  const brand = getFragranceBrand(uf)
  const family = getFragranceFamily(uf)
  const imageUrl = getFragranceImageUrl(uf)
  const familyDef = getScentFamily(family)
  const scentAttr = familyDef.id

  return (
    <div
      data-scent={scentAttr}
      className="relative flex flex-col items-center py-8 px-5"
      style={{ backgroundColor: "var(--scent-accent-light)" }}
    >
      {/* Bottle image */}
      <div
        className="flex h-32 w-32 items-center justify-center rounded-[20px] shadow-md"
        style={{ backgroundColor: imageUrl ? "transparent" : "var(--scent-accent)" }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={128}
            height={128}
            className="h-full w-full rounded-[20px] object-cover"
          />
        ) : (
          <Droplets size={48} className="text-white" />
        )}
      </div>

      {/* Info */}
      <h1
        className="mt-4 text-2xl font-semibold tracking-tight text-center"
        style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
      >
        {name}
      </h1>
      <p className="mt-1 text-base" style={{ color: "var(--text-secondary)" }}>
        {brand}
      </p>
      <span className={`scent-tag scent-tag-${scentAttr} mt-3`}>
        {familyDef.emoji} {familyDef.labelEs}
      </span>
    </div>
  )
}
