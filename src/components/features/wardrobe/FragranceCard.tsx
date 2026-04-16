import Image from "next/image"
import Link from "next/link"
import { Droplets } from "lucide-react"
import type { UserFragrance } from "@/types/fragrance"
import {
  getFragranceName,
  getFragranceBrand,
  getFragranceFamily,
  getFragranceImageUrl,
} from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"

interface FragranceCardProps {
  userFragrance: UserFragrance
  variant?: "compact" | "full"
}

export function FragranceCard({
  userFragrance: uf,
  variant = "compact",
}: FragranceCardProps) {
  const name = getFragranceName(uf)
  const brand = getFragranceBrand(uf)
  const family = getFragranceFamily(uf)
  const imageUrl = getFragranceImageUrl(uf)
  const familyDef = getScentFamily(family)
  const scentAttr = familyDef.id

  if (variant === "full") {
    return (
      <Link href={`/wardrobe/${uf.id}`}>
        <div
          data-scent={scentAttr}
          className="flex items-center gap-3 rounded-[16px] p-3 transition-shadow hover:shadow-md"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          {/* Bottle avatar */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px]"
            style={{ backgroundColor: imageUrl ? "transparent" : "var(--scent-accent-light)" }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={56}
                height={56}
                className="h-full w-full rounded-[12px] object-cover"
              />
            ) : (
              <Droplets
                size={22}
                style={{ color: "var(--scent-accent)" }}
              />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className="truncate text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {name}
            </p>
            <p className="truncate text-xs" style={{ color: "var(--text-secondary)" }}>
              {brand}
            </p>
          </div>

          {/* Family tag */}
          <span className={`scent-tag scent-tag-${scentAttr} shrink-0`}>
            {familyDef.emoji}
          </span>
        </div>
      </Link>
    )
  }

  // Compact (grid card)
  return (
    <Link href={`/wardrobe/${uf.id}`}>
      <div
        data-scent={scentAttr}
        className="flex flex-col rounded-[16px] p-3 transition-shadow hover:shadow-md"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        {/* Bottle avatar */}
        <div
          className="mb-3 flex h-28 w-full items-center justify-center rounded-[12px]"
          style={{ backgroundColor: "var(--scent-accent-light)" }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              width={112}
              height={112}
              className="h-full w-full rounded-[12px] object-cover"
            />
          ) : (
            <Droplets
              size={36}
              style={{ color: "var(--scent-accent)" }}
              strokeWidth={1.5}
            />
          )}
        </div>

        {/* Info */}
        <p
          className="truncate text-sm font-semibold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {name}
        </p>
        <p className="truncate text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {brand}
        </p>
        <div className="mt-2">
          <span className={`scent-tag scent-tag-${scentAttr}`}>
            {familyDef.emoji} {familyDef.labelEs}
          </span>
        </div>
      </div>
    </Link>
  )
}
