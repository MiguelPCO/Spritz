"use client"

import { OCCASIONS } from "@/lib/constants/occasions"
import { cn } from "@/lib/utils"

interface OccasionSelectorProps {
  value: string[]
  onToggle: (id: string) => void
}

export function OccasionSelector({ value, onToggle }: OccasionSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OCCASIONS.map((occasion) => {
        const isSelected = value.includes(occasion.id)
        return (
          <button
            key={occasion.id}
            onClick={() => onToggle(occasion.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
            )}
            style={{
              backgroundColor: isSelected ? "var(--scent-accent)" : "var(--bg-surface)",
              color: isSelected ? "#ffffff" : "var(--text-secondary)",
              border: isSelected
                ? "1.5px solid var(--scent-accent)"
                : "1.5px solid var(--border-subtle)",
            }}
          >
            <span>{occasion.icon}</span>
            <span>{occasion.label}</span>
          </button>
        )
      })}
    </div>
  )
}
