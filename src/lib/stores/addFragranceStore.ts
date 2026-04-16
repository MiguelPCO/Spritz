import { create } from "zustand"
import type { ScentFamily } from "@/lib/constants/scentFamilies"
import type { FragranceCatalogResult } from "@/lib/api/parfumo"

type WizardStep = "search" | "manual" | "tags"

interface DraftFragrance {
  // From catalog search — store the full result to avoid re-fetching in TagsStep
  catalogResult?: FragranceCatalogResult
  // Manual entry / overrides
  name?: string
  brand?: string
  family?: ScentFamily
  topNotes?: string[]
  middleNotes?: string[]
  baseNotes?: string[]
  description?: string
  imageUrl?: string
  // Personal
  photoUrl?: string
  personalNotes?: string
  occasionTags: string[]
  seasonTags: string[]
  moodTags: string[]
}

interface AddFragranceStore {
  step: WizardStep
  draft: DraftFragrance
  setStep: (step: WizardStep) => void
  updateDraft: (partial: Partial<DraftFragrance>) => void
  resetDraft: () => void
}

const EMPTY_DRAFT: DraftFragrance = {
  occasionTags: [],
  seasonTags: [],
  moodTags: [],
}

export const useAddFragranceStore = create<AddFragranceStore>((set) => ({
  step: "search",
  draft: { ...EMPTY_DRAFT },
  setStep: (step) => set({ step }),
  updateDraft: (partial) =>
    set((state) => ({ draft: { ...state.draft, ...partial } })),
  resetDraft: () => set({ step: "search", draft: { ...EMPTY_DRAFT } }),
}))
