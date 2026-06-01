"use client"

import { use, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { FragranceHeader } from "@/components/features/detail/FragranceHeader"
import { NotesDisplay } from "@/components/features/detail/NotesDisplay"
import { PersonalTags } from "@/components/features/detail/PersonalTags"
import { DetailActions } from "@/components/features/detail/DetailActions"
import { FragranceCard } from "@/components/features/wardrobe/FragranceCard"
import { useFragrance } from "@/lib/hooks/useFragrance"
import { useWardrobe } from "@/lib/hooks/useWardrobe"
import { useLastWornByFragrance } from "@/lib/hooks/useWearLog"
import { getFragranceName, getFragranceFamily } from "@/types/fragrance"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  params: Promise<{ id: string }>
}

export function FragranceDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const { data: uf, isLoading } = useFragrance(id)
  const { data: allFragrances = [] } = useWardrobe()
  const { data: lastWornAt } = useLastWornByFragrance(id)

  const similar = useMemo(() => {
    if (!uf) return []
    const family = getFragranceFamily(uf)
    return allFragrances
      .filter((f) => f.id !== uf.id && getFragranceFamily(f) === family && f.status === "active")
      .slice(0, 3)
  }, [uf, allFragrances])

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-64 w-full" />
        <div className="space-y-4 p-5">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    )
  }

  if (!uf) {
    return (
      <div className="flex flex-col items-center py-12 text-center px-5">
        <p className="text-2xl mb-2">❌</p>
        <p className="font-semibold" style={{ fontFamily: "var(--font-jakarta)" }}>
          Fragancia no encontrada
        </p>
      </div>
    )
  }

  const name = getFragranceName(uf)
  const topNotes = uf.fragrance?.top_notes ?? (uf.custom_notes as { top?: string[] })?.top ?? []
  const middleNotes = uf.fragrance?.middle_notes ?? (uf.custom_notes as { middle?: string[] })?.middle ?? []
  const baseNotes = uf.fragrance?.base_notes ?? (uf.custom_notes as { base?: string[] })?.base ?? []

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
        aria-label="Volver"
      >
        <ChevronLeft size={20} style={{ color: "var(--text-primary)" }} />
      </button>

      <FragranceHeader userFragrance={uf} lastWornAt={lastWornAt ?? null} />

      <div className="space-y-6 py-6">
        <NotesDisplay
          topNotes={topNotes}
          middleNotes={middleNotes}
          baseNotes={baseNotes}
        />

        <PersonalTags
          occasionTags={uf.occasion_tags}
          seasonTags={uf.season_tags}
          moodTags={uf.mood_tags}
        />

        {uf.personal_notes && (
          <div className="px-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}>
              Notas personales
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {uf.personal_notes}
            </p>
          </div>
        )}

        {similar.length > 0 && (
          <div className="px-5 space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Similar en tu colección
            </p>
            {similar.map((f) => (
              <FragranceCard key={f.id} userFragrance={f} variant="full" />
            ))}
          </div>
        )}

        <hr style={{ borderColor: "var(--border-subtle)" }} className="mx-5" />

        <DetailActions userFragrance={uf} fragranceName={name} />
      </div>
    </div>
  )
}
