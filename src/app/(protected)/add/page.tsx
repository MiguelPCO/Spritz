"use client"

import { useAddFragranceStore } from "@/lib/stores/addFragranceStore"
import { SearchStep } from "@/components/features/add/SearchStep"
import { ManualEntryForm } from "@/components/features/add/ManualEntryForm"
import { TagsStep } from "@/components/features/add/TagsStep"
import { TopBar } from "@/components/layout/TopBar"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const STEP_LABELS: Record<string, string> = {
  search: "Añadir fragancia",
  manual: "Entrada manual",
  tags: "Personalizar",
}

const STEP_PROGRESS: Record<string, number> = {
  search: 1,
  manual: 2,
  tags: 3,
}

export default function AddFragrancePage() {
  const router = useRouter()
  const { step, resetDraft } = useAddFragranceStore()

  function handleBack() {
    resetDraft()
    router.push("/wardrobe")
  }

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <TopBar
        title={STEP_LABELS[step] ?? "Añadir fragancia"}
        leftSlot={
          <button onClick={handleBack} aria-label="Volver">
            <ChevronLeft size={22} style={{ color: "var(--text-primary)" }} />
          </button>
        }
      />

      {/* Progress indicator */}
      <div className="flex gap-1 px-5 pb-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor:
                n <= STEP_PROGRESS[step]
                  ? "var(--scent-accent)"
                  : "var(--bg-surface)",
            }}
          />
        ))}
      </div>

      <div className="px-5 py-2 md:max-w-lg md:mx-auto md:pt-10">
        {step === "search" && <SearchStep />}
        {step === "manual" && <ManualEntryForm />}
        {step === "tags" && <TagsStep />}
      </div>
    </div>
  )
}
