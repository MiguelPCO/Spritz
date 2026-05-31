"use client"

import { TopBar } from "@/components/layout/TopBar"
import { WardrobeFilters } from "@/components/features/wardrobe/WardrobeFilters"
import { FragranceGrid } from "@/components/features/wardrobe/FragranceGrid"
import { ViewToggle } from "@/components/features/wardrobe/ViewToggle"
import { useWardrobe } from "@/lib/hooks/useWardrobe"
import { useLastWornDates } from "@/lib/hooks/useWearLog"

export default function WardrobePage() {
  const { data: wardrobe = [], isLoading } = useWardrobe()
  const { data: lastWornDates = {} } = useLastWornDates()

  const collection = wardrobe.filter((uf) => uf.status !== "wishlist")

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <TopBar
        title={`Mi Colección${collection.length > 0 ? ` (${collection.length})` : ""}`}
        rightSlot={<ViewToggle />}
      />

      <div className="space-y-4 pb-6">
        <WardrobeFilters />
        <FragranceGrid fragrances={collection} isLoading={isLoading} lastWornDates={lastWornDates} />
      </div>
    </div>
  )
}
