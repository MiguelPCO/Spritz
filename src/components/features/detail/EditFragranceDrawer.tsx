"use client"

import { useState, useTransition, useRef } from "react"
import { toast } from "sonner"
import { Loader2, Camera, X } from "lucide-react"
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { OCCASIONS } from "@/lib/constants/occasions"
import { MOODS } from "@/lib/constants/moods"
import { updateFragrance } from "@/lib/actions/fragrance.actions"
import { createClient } from "@/lib/supabase/client"
import { queryKeys } from "@/lib/constants/queryKeys"
import type { UserFragrance } from "@/types/fragrance"

const SEASONS = [
  { id: "spring", label: "Primavera", icon: "🌸" },
  { id: "summer", label: "Verano",    icon: "☀️" },
  { id: "autumn", label: "Otoño",     icon: "🍂" },
  { id: "winter", label: "Invierno",  icon: "❄️" },
]

const STATUSES: Array<{ id: string; label: string }> = [
  { id: "active",   label: "Activo"     },
  { id: "empty",    label: "Vacío"      },
  { id: "wishlist", label: "Lista deseos" },
  { id: "sold",     label: "Vendido"    },
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
              type="button"
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

interface EditFragranceDrawerProps {
  userFragrance: UserFragrance
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditFragranceDrawer({ userFragrance: uf, open, onOpenChange }: EditFragranceDrawerProps) {
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pre-populate from existing data
  const [photoUrl, setPhotoUrl] = useState<string | null>(uf.photo_url)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [occasionTags, setOccasionTags] = useState<string[]>(uf.occasion_tags ?? [])
  const [seasonTags, setSeasonTags] = useState<string[]>(uf.season_tags ?? [])
  const [moodTags, setMoodTags] = useState<string[]>(uf.mood_tags ?? [])
  const [personalNotes, setPersonalNotes] = useState(uf.personal_notes ?? "")
  const [status, setStatus] = useState<"active" | "empty" | "wishlist" | "sold">(uf.status ?? "active")
  const [mlRemaining, setMlRemaining] = useState<string>(
    uf.ml_remaining != null ? String(uf.ml_remaining) : ""
  )

  function toggle(arr: string[], setArr: (v: string[]) => void, id: string) {
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id])
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

      const { data: signedData, error: signError } = await supabase.storage
        .from("fragrance-photos")
        .createSignedUrl(path, 315_360_000)
      if (signError || !signedData) throw signError ?? new Error("No se pudo obtener la URL")

      setPhotoUrl(signedData.signedUrl)
      toast.success("Foto actualizada")
    } catch (err) {
      toast.error("Error al subir la foto", {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await updateFragrance(uf.id, {
          personalNotes: personalNotes || undefined,
          occasionTags,
          seasonTags,
          moodTags,
          status,
          mlRemaining: mlRemaining !== "" ? Number(mlRemaining) : null,
          photoUrl,
        })
        // Invalidate cache so detail + wardrobe list refresh
        queryClient.invalidateQueries({ queryKey: queryKeys.wardrobe.all })
        toast.success("Fragancia actualizada")
        onOpenChange(false)
      } catch (err) {
        toast.error("Error al guardar", {
          description: err instanceof Error ? err.message : undefined,
        })
      }
    })
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent style={{ backgroundColor: "var(--bg-card)" }}>
        <DrawerHeader>
          <DrawerTitle style={{ fontFamily: "var(--font-jakarta)" }}>
            Editar fragancia
          </DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto px-5 pb-2 space-y-5" style={{ maxHeight: "70vh" }}>
          {/* Photo */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Foto del frasco
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <div className="flex items-center gap-3">
              {photoUrl ? (
                <div className="relative w-20">
                  <Image
                    src={photoUrl}
                    alt="Foto del frasco"
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-[12px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="flex items-center gap-2 rounded-[12px] px-4 py-3 text-sm font-medium transition-colors"
                style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
              >
                {uploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                {uploadingPhoto ? "Subiendo…" : photoUrl ? "Cambiar foto" : "Añadir foto"}
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Estado
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id as "active" | "empty" | "wishlist" | "sold")}
                  className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    backgroundColor: status === s.id ? "var(--scent-accent)" : "var(--bg-surface)",
                    color: status === s.id ? "white" : "var(--text-secondary)",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ml remaining */}
          <div className="space-y-1">
            <label
              htmlFor="ml-edit"
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              ml restantes (opcional)
            </label>
            <input
              id="ml-edit"
              type="number"
              min="0"
              max="999"
              value={mlRemaining}
              onChange={(e) => setMlRemaining(e.target.value)}
              placeholder="Ej. 50"
              className="h-11 w-32 rounded-[12px] border px-4 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <ChipGroup
            label="Ocasión"
            items={OCCASIONS}
            selected={occasionTags}
            onToggle={(id) => toggle(occasionTags, setOccasionTags, id)}
          />

          <ChipGroup
            label="Temporada"
            items={SEASONS}
            selected={seasonTags}
            onToggle={(id) => toggle(seasonTags, setSeasonTags, id)}
          />

          <ChipGroup
            label="Estado de ánimo"
            items={MOODS}
            selected={moodTags}
            onToggle={(id) => toggle(moodTags, setMoodTags, id)}
          />

          {/* Personal notes */}
          <div className="space-y-1">
            <label
              htmlFor="notes-edit"
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Notas personales
            </label>
            <textarea
              id="notes-edit"
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
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
        </div>

        <DrawerFooter className="flex flex-row gap-3 px-5">
          <DrawerClose asChild>
            <button
              className="h-11 flex-1 rounded-[12px] text-sm font-medium"
              style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
            >
              Cancelar
            </button>
          </DrawerClose>
          <button
            onClick={handleSave}
            disabled={isPending || uploadingPhoto}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[12px] text-sm font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--scent-accent)" }}
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isPending ? "Guardando…" : "Guardar cambios"}
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
