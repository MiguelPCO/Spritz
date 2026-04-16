"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { FragranceHeader } from "@/components/features/detail/FragranceHeader"
import { NotesDisplay } from "@/components/features/detail/NotesDisplay"
import { PersonalTags } from "@/components/features/detail/PersonalTags"
import { DetailActions } from "@/components/features/detail/DetailActions"
import { useFragrance } from "@/lib/hooks/useFragrance"
import { getFragranceName } from "@/types/fragrance"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  params: Promise<{ id: string }>
}

export default function FragranceDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const { data: uf, isLoading } = useFragrance(id)

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
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
        aria-label="Volver"
      >
        <ChevronLeft size={20} style={{ color: "var(--text-primary)" }} />
      </button>

      {/* Header with scent theming */}
      <FragranceHeader userFragrance={uf} />

      {/* Content sections */}
      <div className="space-y-6 py-6">
        {/* Olfactory notes */}
        <NotesDisplay
          topNotes={topNotes}
          middleNotes={middleNotes}
          baseNotes={baseNotes}
        />

        {/* Personal tags */}
        <PersonalTags
          occasionTags={uf.occasion_tags}
          seasonTags={uf.season_tags}
          moodTags={uf.mood_tags}
        />

        {/* Personal notes */}
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

        {/* Separator */}
        <hr style={{ borderColor: "var(--border-subtle)" }} className="mx-5" />

        {/* Actions */}
        <DetailActions userFragrance={uf} fragranceName={name} />
      </div>
    </div>
  )
}
