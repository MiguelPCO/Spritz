"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Camera, X } from "lucide-react"
import Image from "next/image"
import { OCCASIONS } from "@/lib/constants/occasions"
import { MOODS } from "@/lib/constants/moods"
import { useAddFragranceStore } from "@/lib/stores/addFragranceStore"
import { addToWardrobe } from "@/lib/actions/fragrance.actions"
import { createClient } from "@/lib/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/constants/queryKeys"

const SEASONS = [
  { id: "spring", label: "Primavera", icon: "🌸" },
  { id: "summer", label: "Verano",    icon: "☀️" },
  { id: "autumn", label: "Otoño",     icon: "🍂" },
  { id: "winter", label: "Invierno",  icon: "❄️" },
]

function ChipGroup({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string
  items: Array<{ id: string; label: string; icon?: string }>
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selected.includes(item.id)
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                backgroundColor: isSelected ? "var(--scent-accent)" : "var(--bg-surface)",
                color: isSelected ? "white" : "var(--text-secondary)",
              }}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function TagsStep() {
  const router = useRouter()
  const { draft, setStep, updateDraft, resetDraft } = useAddFragranceStore()
  const queryClient = useQueryClient()
  const [occasionTags, setOccasionTags] = useState<string[]>(() => draft.occasionTags)
  const [seasonTags, setSeasonTags] = useState<string[]>(() => draft.seasonTags)
  const [moodTags, setMoodTags] = useState<string[]>(() => draft.moodTags)
  const [personalNotes, setPersonalNotes] = useState(() => draft.personalNotes ?? "")
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(() => draft.photoUrl ?? undefined)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const submittingRef = useRef(false)

  function toggle(
    arr: string[],
    setArr: (v: string[]) => void,
    id: string,
    draftKey: "occasionTags" | "seasonTags" | "moodTags",
  ) {
    const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]
    setArr(next)
    updateDraft({ [draftKey]: next })
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No autenticado")

      const ext = file.name.split(".").pop() ?? "jpg"
      const path = `${user.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("fragrance-photos")
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      // Signed URL valid for 10 years
      const { data: signedData, error: signError } = await supabase.storage
        .from("fragrance-photos")
        .createSignedUrl(path, 315_360_000)

      if (signError || !signedData) throw signError ?? new Error("No se pudo obtener la URL")

      setPhotoUrl(signedData.signedUrl)
      updateDraft({ photoUrl: signedData.signedUrl })
      toast.success("Foto subida correctamente")
    } catch (err) {
      toast.error("Error al subir la foto", {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleSave() {
    if (submittingRef.current) return
    submittingRef.current = true
    startTransition(async () => {
      try {
        await addToWardrobe({
          catalogResult: draft.catalogResult,
          customName: !draft.catalogResult ? draft.name : undefined,
          customBrand: !draft.catalogResult ? draft.brand : undefined,
          customFamilies: !draft.catalogResult ? draft.families : undefined,
          customImageUrl: !draft.catalogResult ? draft.imageUrl : undefined,
          customTopNotes: !draft.catalogResult ? draft.topNotes : undefined,
          customMiddleNotes: !draft.catalogResult ? draft.middleNotes : undefined,
          customBaseNotes: !draft.catalogResult ? draft.baseNotes : undefined,
          personalNotes: personalNotes || undefined,
          photoUrl,
          occasionTags,
          seasonTags,
          moodTags,
        })

        toast.success(`${draft.name} añadido a la colección`)
        resetDraft()
        await queryClient.invalidateQueries({ queryKey: queryKeys.wardrobe.all })
        router.push("/wardrobe")
      } catch (err) {
        toast.error("Error al guardar", {
          description: err instanceof Error ? err.message : undefined,
        })
      } finally {
        submittingRef.current = false
      }
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
        >
          Personaliza tu fragancia
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          {draft.name} · {draft.brand}
        </p>
      </div>

      {/* Photo upload */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Foto del frasco (opcional)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
        {photoUrl ? (
          <div className="relative w-24">
            <Image
              src={photoUrl}
              alt="Foto del frasco"
              width={96}
              height={96}
              className="h-24 w-24 rounded-[12px] object-cover"
            />
            <button
              onClick={() => { setPhotoUrl(undefined); updateDraft({ photoUrl: undefined }) }}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
            >
              <X size={10} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="flex items-center gap-2 rounded-[12px] px-4 py-3 text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
          >
            {uploadingPhoto ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Camera size={16} />
            )}
            {uploadingPhoto ? "Subiendo…" : "Añadir foto del frasco"}
          </button>
        )}
      </div>

      <ChipGroup
        label="Ocasión"
        items={OCCASIONS}
        selected={occasionTags}
        onToggle={(id) => toggle(occasionTags, setOccasionTags, id, "occasionTags")}
      />

      <ChipGroup
        label="Temporada"
        items={SEASONS}
        selected={seasonTags}
        onToggle={(id) => toggle(seasonTags, setSeasonTags, id, "seasonTags")}
      />

      <ChipGroup
        label="Estado de ánimo"
        items={MOODS}
        selected={moodTags}
        onToggle={(id) => toggle(moodTags, setMoodTags, id, "moodTags")}
      />

      {/* Personal notes */}
      <div className="space-y-1">
        <label
          htmlFor="notes"
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          Notas personales (opcional)
        </label>
        <textarea
          id="notes"
          value={personalNotes}
          onChange={(e) => { setPersonalNotes(e.target.value); updateDraft({ personalNotes: e.target.value }) }}
          placeholder="Tu opinión, cuándo la usas, recuerdos…"
          rows={3}
          className="w-full rounded-[12px] border px-4 py-3 text-sm outline-none resize-none"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(draft.catalogResult ? "search" : "manual")}
          className="h-11 flex-1 rounded-[12px] text-sm font-medium"
          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
        >
          Volver
        </button>
        <button
          onClick={handleSave}
          disabled={isPending || uploadingPhoto}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[12px] text-sm font-medium text-white disabled:opacity-60"
          style={{ backgroundColor: "var(--scent-accent)" }}
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? "Guardando…" : "Añadir a la colección"}
        </button>
      </div>
    </div>
  )
}
