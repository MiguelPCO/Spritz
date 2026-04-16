"use client"

import type { Metadata } from "next"
import { TopBar } from "@/components/layout/TopBar"
import { WardrobeFilters } from "@/components/features/wardrobe/WardrobeFilters"
import { FragranceGrid } from "@/components/features/wardrobe/FragranceGrid"
import { ViewToggle } from "@/components/features/wardrobe/ViewToggle"
import { useWardrobe } from "@/lib/hooks/useWardrobe"

export default function WardrobePage() {
  const { data: wardrobe = [], isLoading } = useWardrobe()

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <TopBar
        title={`Mi Colección${wardrobe.length > 0 ? ` (${wardrobe.length})` : ""}`}
        rightSlot={<ViewToggle />}
      />

      <div className="space-y-4 pb-6">
        <WardrobeFilters />
        <FragranceGrid fragrances={wardrobe} isLoading={isLoading} />
      </div>
    </div>
  )
}
