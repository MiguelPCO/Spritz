import { create } from "zustand"
import type { ScentFamily } from "@/lib/constants/scentFamilies"

type ViewMode = "grid" | "list"
export type SortBy = "date_added" | "name" | "brand"

interface WardrobeStore {
  viewMode: ViewMode
  activeFilter: ScentFamily | null
  searchQuery: string
  sortBy: SortBy
  setViewMode: (mode: ViewMode) => void
  setActiveFilter: (family: ScentFamily | null) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: SortBy) => void
  reset: () => void
}

export const useWardrobeStore = create<WardrobeStore>((set) => ({
  viewMode: "grid",
  activeFilter: null,
  searchQuery: "",
  sortBy: "date_added",
  setViewMode: (viewMode) => set({ viewMode }),
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () => set({ viewMode: "grid", activeFilter: null, searchQuery: "", sortBy: "date_added" }),
}))
