export interface Mood {
  id: string
  label: string
  icon: string
}

export const MOODS: Mood[] = [
  { id: "fresh",    label: "Fresco",    icon: "💧" },
  { id: "cozy",     label: "Acogedor",  icon: "🧸" },
  { id: "bold",     label: "Atrevido",  icon: "🔥" },
  { id: "elegant",  label: "Elegante",  icon: "🌹" },
  { id: "playful",  label: "Juguetón",  icon: "🎉" },
  { id: "relaxed",  label: "Relajado",  icon: "😌" },
  { id: "romantic", label: "Romántico", icon: "💫" },
]
