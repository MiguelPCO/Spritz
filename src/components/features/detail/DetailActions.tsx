"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2, Pencil } from "lucide-react"
import { useDeleteFragrance } from "@/lib/hooks/useWardrobe"
import { logWear } from "@/lib/actions/wear.actions"
import { EditFragranceDrawer } from "@/components/features/detail/EditFragranceDrawer"
import type { UserFragrance } from "@/types/fragrance"

interface DetailActionsProps {
  userFragrance: UserFragrance
  fragranceName: string
}

export function DetailActions({ userFragrance, fragranceName }: DetailActionsProps) {
  const router = useRouter()
  const [wearing, setWearing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const deleteFragrance = useDeleteFragrance()

  async function handleWear() {
    setWearing(true)
    try {
      await logWear({
        userFragranceId: userFragrance.id,
        occasion: null,
        mood: null,
        weather: null,
        aiRecommended: false,
      })
      toast.success(`¡${fragranceName} registrado!`)
    } catch (err) {
      toast.error("Error al registrar")
    } finally {
      setWearing(false)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    await deleteFragrance.mutateAsync(userFragrance.id)
    router.push("/wardrobe")
  }

  return (
    <>
      <div className="flex gap-3 px-5">
        <button
          onClick={handleWear}
          disabled={wearing}
          className="h-12 flex-1 rounded-[12px] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "var(--scent-accent)" }}
        >
          {wearing ? "Registrando…" : "Me lo pongo hoy"}
        </button>

        <button
          onClick={() => setEditOpen(true)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] transition-colors"
          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
          title="Editar fragancia"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={handleDelete}
          disabled={deleteFragrance.isPending}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] transition-colors"
          style={{
            backgroundColor: confirmDelete ? "#C03A3A" : "var(--bg-surface)",
            color: confirmDelete ? "white" : "var(--text-muted)",
          }}
          title={confirmDelete ? "¿Confirmar eliminación?" : "Eliminar fragancia"}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <EditFragranceDrawer
        userFragrance={userFragrance}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}
