"use client"

import { useState, useTransition } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { WishlistItem } from "./WishlistItem"
import { updateWishlistPositions } from "@/lib/actions/fragrance.actions"
import { queryKeys } from "@/lib/constants/queryKeys"
import type { UserFragrance } from "@/types/fragrance"

interface WishlistSortableProps {
  wishlist: UserFragrance[]
}

export function WishlistSortable({ wishlist: initialWishlist }: WishlistSortableProps) {
  const sorted = [...initialWishlist].sort((a, b) => {
    if (a.wishlist_position === null && b.wishlist_position === null) return 0
    if (a.wishlist_position === null) return 1
    if (b.wishlist_position === null) return -1
    return a.wishlist_position - b.wishlist_position
  })

  const [items, setItems] = useState<UserFragrance[]>(sorted)
  const [, startTransition] = useTransition()
  const queryClient = useQueryClient()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex)

    setItems(reordered)

    startTransition(async () => {
      try {
        await updateWishlistPositions(reordered.map((uf, i) => ({ id: uf.id, position: i })))
        queryClient.invalidateQueries({ queryKey: queryKeys.wardrobe.all })
      } catch {
        toast.error("Error al guardar orden")
      }
    })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((uf) => (
            <WishlistItem key={uf.id} userFragrance={uf} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
