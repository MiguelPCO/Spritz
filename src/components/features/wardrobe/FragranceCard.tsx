import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { UserFragrance } from "@/types/fragrance"
import {
  getFragranceName,
  getFragranceBrand,
  getFragranceFamily,
  getFragranceFamilies,
  getFragranceImageUrl,
} from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"

interface FragranceCardProps {
  userFragrance: UserFragrance
  variant?: "compact" | "full"
  lastWornAt?: string
}

const STATUS_LABEL: Record<string, string> = {
  wishlist: "Lista de deseos",
  empty: "Casi vacía",
  sold: "Vendida",
}

export function FragranceCard({
  userFragrance: uf,
  variant = "compact",
  lastWornAt,
}: FragranceCardProps) {
  const name = getFragranceName(uf)
  const brand = getFragranceBrand(uf)
  const family = getFragranceFamily(uf)
  const families = getFragranceFamilies(uf)
  const imageUrl = getFragranceImageUrl(uf)
  const familyDef = getScentFamily(family)
  const scentAttr = familyDef.id

  const isNeglected =
    uf.status === "active" &&
    (!lastWornAt ||
      (Date.now() - new Date(lastWornAt).getTime()) / (1000 * 60 * 60 * 24) >= 14)

  if (variant === "full") {
    const visibleFamilies = families.slice(0, 2)
    const extraCount = families.length - visibleFamilies.length

    return (
      <Link href={`/wardrobe/${uf.id}`}>
        <div
          data-scent={scentAttr}
          className="flex items-center gap-3 rounded-[16px] p-3 transition-shadow hover:shadow-md"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          {/* Thumbnail */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px]"
            style={{ backgroundColor: "var(--scent-accent-light)" }}
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
              <span className="text-xl select-none">{familyDef.emoji}</span>
            )}
          </div>

          {/* Info — name, brand, tags row */}
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {name}
            </p>
            <p className="truncate text-xs mb-1.5" style={{ color: "var(--text-secondary)" }}>
              {brand}
            </p>
            <div className="flex flex-wrap items-center gap-1">
              {visibleFamilies.map((fid) => {
                const fd = getScentFamily(fid)
                return (
                  <span key={fid} className={`scent-tag scent-tag-${fd.id}`}>
                    {fd.emoji} {fd.labelEs}
                  </span>
                )
              })}
              {extraCount > 0 && (
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  +{extraCount}
                </span>
              )}
              {uf.status !== "active" && STATUS_LABEL[uf.status] && (
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-medium"
                  style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
                >
                  {STATUS_LABEL[uf.status]}
                </span>
              )}
              {isNeglected && (
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                  style={{ backgroundColor: "var(--scent-accent-light)", color: "var(--scent-accent)" }}
                >
                  💤 14d+
                </span>
              )}
            </div>
          </div>

          {/* Chevron */}
          <ChevronRight size={16} className="shrink-0" style={{ color: "var(--text-muted)" }} />
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
          className="relative mb-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-[12px]"
          style={{ backgroundColor: "var(--scent-accent-light)" }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="rounded-[12px] object-cover"
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ) : (
            <span
              className="text-3xl select-none"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
            >
              {familyDef.emoji}
            </span>
          )}

          {isNeglected && (
            <span
              className="absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold"
              style={{ backgroundColor: "var(--scent-accent)", color: "white" }}
            >
              💤 Sin usar 14d+
            </span>
          )}

          {uf.status !== "active" && STATUS_LABEL[uf.status] && (
            <span
              className="absolute bottom-0 left-0 right-0 py-1 text-center text-[10px] font-medium"
              style={{
                backgroundColor: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(4px)",
                color: "var(--text-secondary)",
              }}
            >
              {STATUS_LABEL[uf.status]}
            </span>
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
        <div className="mt-2 flex flex-wrap gap-1">
          {families.map((fid) => {
            const fd = getScentFamily(fid)
            return (
              <span key={fid} className={`scent-tag scent-tag-${fd.id}`}>
                {fd.emoji} {fd.labelEs}
              </span>
            )
          })}
        </div>
      </div>
    </Link>
  )
}
