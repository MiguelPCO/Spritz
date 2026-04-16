"use client"

import { MOODS } from "@/lib/constants/moods"

interface MoodSelectorProps {
  value: string[]
  onChange: (moods: string[]) => void
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((m) => m !== id) : [...value, id])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((mood) => {
        const isSelected = value.includes(mood.id)
        return (
          <button
            key={mood.id}
            onClick={() => toggle(mood.id)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              backgroundColor: isSelected ? "var(--scent-accent)" : "var(--bg-surface)",
              color: isSelected ? "#ffffff" : "var(--text-secondary)",
              border: isSelected ? "1.5px solid var(--scent-accent)" : "1.5px solid var(--border-subtle)",
            }}
          >
            <span>{mood.icon}</span>
            <span>{mood.label}</span>
          </button>
        )
      })}
    </div>
  )
}
