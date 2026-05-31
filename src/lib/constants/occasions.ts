export interface Occasion {
  id: string
  label: string
  icon: string
}

export const OCCASIONS: Occasion[] = [
  { id: "work",    label: "Trabajo",    icon: "💼" },
  { id: "casual",  label: "Casual",     icon: "👕" },
  { id: "date",    label: "Cita",       icon: "💕" },
  { id: "sport",   label: "Deporte",    icon: "🏃" },
  { id: "formal",  label: "Formal",     icon: "🤵" },
  { id: "day",     label: "Día",        icon: "☀️" },
  { id: "night",   label: "Noche",      icon: "🌙" },
  { id: "outdoor", label: "Exterior",   icon: "🌳" },
]
