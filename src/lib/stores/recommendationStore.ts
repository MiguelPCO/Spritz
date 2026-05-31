import { create } from "zustand"

interface RecommendationStore {
  occasions: string[]
  moods: string[]
  freeText: string
  toggleOccasion: (id: string) => void
  toggleMood: (id: string) => void
  setFreeText: (text: string) => void
  reset: () => void
}

export const useRecommendationStore = create<RecommendationStore>((set) => ({
  occasions: [],
  moods: [],
  freeText: "",
  toggleOccasion: (id) =>
    set((state) => ({
      occasions: state.occasions.includes(id)
        ? state.occasions.filter((o) => o !== id)
        : [...state.occasions, id],
    })),
  toggleMood: (id) =>
    set((state) => ({
      moods: state.moods.includes(id)
        ? state.moods.filter((m) => m !== id)
        : [...state.moods, id],
    })),
  setFreeText: (freeText) => set({ freeText }),
  reset: () => set({ occasions: [], moods: [], freeText: "" }),
}))
