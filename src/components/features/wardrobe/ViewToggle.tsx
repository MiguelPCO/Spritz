"use client"

import { LayoutGrid, List } from "lucide-react"
import { useWardrobeStore } from "@/lib/stores/wardrobeStore"

export function ViewToggle() {
  const { viewMode, setViewMode } = useWardrobeStore()

  return (
    <div
      className="flex rounded-[8px] p-0.5"
      style={{ backgroundColor: "var(--bg-surface)" }}
    >
      <button
        onClick={() => setViewMode("grid")}
        className="rounded-[6px] p-1.5 transition-colors"
        style={{
          backgroundColor: viewMode === "grid" ? "white" : "transparent",
          color: viewMode === "grid" ? "var(--text-primary)" : "var(--text-muted)",
        }}
        aria-label="Vista cuadrícula"
      >
        <LayoutGrid size={16} />
      </button>
      <button
        onClick={() => setViewMode("list")}
        className="rounded-[6px] p-1.5 transition-colors"
        style={{
          backgroundColor: viewMode === "list" ? "white" : "transparent",
          color: viewMode === "list" ? "var(--text-primary)" : "var(--text-muted)",
        }}
        aria-label="Vista lista"
      >
        <List size={16} />
      </button>
    </div>
  )
}
