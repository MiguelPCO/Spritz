import Image from "next/image"
import type { UserFragrance } from "@/types/fragrance"
import {
  getFragranceName,
  getFragranceBrand,
  getFragranceFamily,
  getFragranceImageUrl,
} from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface FragranceHeaderProps {
  userFragrance: UserFragrance
  lastWornAt?: string | null
}

export function FragranceHeader({ userFragrance: uf, lastWornAt }: FragranceHeaderProps) {
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
        style={{ backgroundColor: imageUrl ? "transparent" : "var(--scent-accent-light)" }}
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
          <span className="text-5xl select-none">{familyDef.emoji}</span>
        )}
      </div>

      {/* Info */}
      <h1
        className="mt-4 text-2xl font-light tracking-tight text-center"
        style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
      >
        {name}
      </h1>
      <p className="mt-1 text-base" style={{ color: "var(--text-secondary)" }}>
        {brand}
      </p>
      <span className={`scent-tag scent-tag-${scentAttr} mt-3`}>
        {familyDef.emoji} {familyDef.labelEs}
      </span>
      {lastWornAt && (
        <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
          Última vez {formatDistanceToNow(new Date(lastWornAt), { addSuffix: true, locale: es })}
        </p>
      )}
    </div>
  )
}
