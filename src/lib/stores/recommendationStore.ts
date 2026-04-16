import { create } from "zustand"

interface RecommendationStore {
  occasion: string | null
  moods: string[]
  setOccasion: (occasion: string | null) => void
  toggleMood: (id: string) => void
  reset: () => void
}

export const useRecommendationStore = create<RecommendationStore>((set) => ({
  occasion: null,
  moods: [],
  setOccasion: (occasion) => set({ occasion }),
  toggleMood: (id) =>
    set((state) => ({
      moods: state.moods.includes(id)
        ? state.moods.filter((m) => m !== id)
        : [...state.moods, id],
    })),
  reset: () => set({ occasion: null, moods: [] }),
}))
