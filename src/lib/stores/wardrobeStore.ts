import { create } from "zustand"
import type { ScentFamily } from "@/lib/constants/scentFamilies"

type ViewMode = "grid" | "list"

interface WardrobeStore {
  viewMode: ViewMode
  activeFilter: ScentFamily | null
  searchQuery: string
  setViewMode: (mode: ViewMode) => void
  setActiveFilter: (family: ScentFamily | null) => void
  setSearchQuery: (query: string) => void
  reset: () => void
}

export const useWardrobeStore = create<WardrobeStore>((set) => ({
  viewMode: "grid",
  activeFilter: null,
  searchQuery: "",
  setViewMode: (viewMode) => set({ viewMode }),
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  reset: () => set({ viewMode: "grid", activeFilter: null, searchQuery: "" }),
}))
