"use client"

import { Check, RefreshCw, Loader2 } from "lucide-react"

interface ActionButtonsProps {
  onWear: () => void
  onSkip: () => void
  wearing: boolean
  loading: boolean
}

export function ActionButtons({ onWear, onSkip, wearing, loading }: ActionButtonsProps) {
  return (
    <div className="flex gap-3 px-5">
      {/* Wear today — primary CTA */}
      <button
        onClick={onWear}
        disabled={wearing || loading}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[12px] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: "var(--scent-accent)" }}
      >
        {wearing ? (
          <>
            <Check size={16} />
            ¡Registrado!
          </>
        ) : (
          "Me lo pongo hoy"
        )}
      </button>

      {/* Try another — secondary */}
      <button
        onClick={onSkip}
        disabled={loading}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] transition-colors"
        style={{
          backgroundColor: "var(--bg-surface)",
          color: "var(--text-secondary)",
        }}
        title="Otra opción"
        aria-label="Sugerir otra fragancia"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <RefreshCw size={18} />
        )}
      </button>
    </div>
  )
}
