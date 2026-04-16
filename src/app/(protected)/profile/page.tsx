"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Pencil, Check, X, LogOut } from "lucide-react"
import { TopBar } from "@/components/layout/TopBar"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfile } from "@/lib/hooks/useProfile"
import { useWardrobe } from "@/lib/hooks/useWardrobe"
import { useRecentWears } from "@/lib/hooks/useWearLog"
import { updateProfile } from "@/lib/actions/profile.actions"
import { createClient } from "@/lib/supabase/client"
import { queryKeys } from "@/lib/constants/queryKeys"

function getInitials(displayName: string | null | undefined, email: string | undefined): string {
  if (displayName?.trim()) {
    return displayName.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
  }
  return email?.[0]?.toUpperCase() ?? "?"
}

export default function ProfilePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: profile, isLoading } = useProfile()
  const { data: wardrobe = [] } = useWardrobe()
  const { data: recentWears = [] } = useRecentWears()
  const [isPending, startTransition] = useTransition()

  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState("")

  function startEdit() {
    setNameInput(profile?.display_name ?? "")
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
  }

  function saveName() {
    if (!nameInput.trim() && !profile?.display_name) {
      setEditing(false)
      return
    }
    startTransition(async () => {
      try {
        await updateProfile({ displayName: nameInput })
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.all })
        toast.success("Nombre actualizado")
        setEditing(false)
      } catch (err) {
        toast.error("Error al guardar", {
          description: err instanceof Error ? err.message : undefined,
        })
      }
    })
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    queryClient.clear()
    router.push("/auth/login")
  }

  const displayName = profile?.display_name || profile?.email?.split("@")[0] || "Usuario"
  const initials = getInitials(profile?.display_name, profile?.email)

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <TopBar title="Perfil" />

      <div className="space-y-5 px-5 pb-8 pt-2">

        {/* Avatar + name */}
        <div
          className="rounded-[20px] p-6 flex flex-col items-center gap-3"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          {isLoading ? (
            <>
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </>
          ) : (
            <>
              {/* Avatar circle */}
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ backgroundColor: "var(--scent-accent)" }}
              >
                {initials}
              </div>

              {/* Editable display name */}
              {editing ? (
                <div className="flex items-center gap-2 w-full max-w-[220px]">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") cancelEdit() }}
                    placeholder="Tu nombre"
                    className="flex-1 rounded-[10px] border px-3 py-1.5 text-sm outline-none text-center"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--scent-accent)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <button onClick={saveName} disabled={isPending} className="text-green-500">
                    <Check size={16} />
                  </button>
                  <button onClick={cancelEdit} style={{ color: "var(--text-muted)" }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={startEdit} className="flex items-center gap-1.5 group">
                  <span
                    className="text-lg font-semibold"
                    style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
                  >
                    {displayName}
                  </span>
                  <Pencil size={13} className="opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "var(--text-muted)" }} />
                </button>
              )}

              {/* Email */}
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {profile?.email}
              </p>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-[16px] p-4 text-center"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <p
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-jakarta)", color: "var(--scent-accent)" }}
            >
              {wardrobe.filter(uf => uf.status === "active").length}
            </p>
            <p className="mt-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Fragancias activas
            </p>
          </div>
          <div
            className="rounded-[16px] p-4 text-center"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <p
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-jakarta)", color: "var(--scent-accent)" }}
            >
              {recentWears.length}
            </p>
            <p className="mt-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Usos esta semana
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-[16px] py-3.5 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "var(--bg-surface)", color: "#C03A3A" }}
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>

      </div>
    </div>
  )
}
