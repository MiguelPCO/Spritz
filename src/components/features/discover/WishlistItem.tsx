"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Target } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { getFragranceName, getFragranceBrand, getFragranceFamily } from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"
import { updateFragrance } from "@/lib/actions/fragrance.actions"
import { queryKeys } from "@/lib/constants/queryKeys"
import type { UserFragrance } from "@/types/fragrance"

interface WishlistItemProps {
  userFragrance: UserFragrance
}

export function WishlistItem({ userFragrance: uf }: WishlistItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: uf.id })
  const queryClient = useQueryClient()
  const [editingPrice, setEditingPrice] = useState(false)
  const [priceInput, setPriceInput] = useState(uf.price_target?.toString() ?? "")
  const [, startTransition] = useTransition()

  const family = getFragranceFamily(uf)
  const familyDef = getScentFamily(family)

  const containerStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: "var(--bg-surface)",
  }

  function savePrice() {
    const value = parseFloat(priceInput)
    const priceTarget = isNaN(value) || priceInput === "" ? null : value
    startTransition(async () => {
      try {
        await updateFragrance(uf.id, { priceTarget })
        queryClient.invalidateQueries({ queryKey: queryKeys.wardrobe.all })
        setEditingPrice(false)
      } catch {
        toast.error("Error al guardar precio")
      }
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={containerStyle}
      className="flex items-center gap-3 rounded-[12px] px-3 py-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing touch-none"
        style={{ color: "var(--text-muted)" }}
        aria-label="Reordenar"
      >
        <GripVertical size={16} />
      </button>

      <span className="text-xl select-none shrink-0">{familyDef.emoji}</span>

      <Link href={`/wardrobe/${uf.id}`} className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {getFragranceName(uf)}
        </p>
        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
          {getFragranceBrand(uf)}
        </p>
      </Link>

      {editingPrice ? (
        <div className="flex items-center gap-1 shrink-0">
          <input
            autoFocus
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            onBlur={savePrice}
            onKeyDown={(e) => {
              if (e.key === "Enter") savePrice()
              if (e.key === "Escape") setEditingPrice(false)
            }}
            type="number"
            placeholder="0"
            className="w-16 rounded-[8px] border px-2 py-1 text-xs text-right outline-none"
            style={{
              borderColor: "var(--scent-accent)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
          />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>€</span>
        </div>
      ) : (
        <button
          onClick={() => setEditingPrice(true)}
          className="flex items-center gap-1 shrink-0 rounded-full px-2 py-1"
          style={{ backgroundColor: uf.price_target ? "var(--scent-accent-light)" : "transparent" }}
        >
          <Target
            size={11}
            style={{ color: uf.price_target ? "var(--scent-accent)" : "var(--text-muted)" }}
          />
          {uf.price_target ? (
            <span className="text-[11px] font-medium" style={{ color: "var(--scent-accent)" }}>
              {uf.price_target}€
            </span>
          ) : (
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>—</span>
          )}
        </button>
      )}
    </div>
  )
}
