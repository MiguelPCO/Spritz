export type ScentFamily =
  | "woody"
  | "fresh"
  | "floral"
  | "oriental"
  | "green"
  | "amber"

export interface ScentFamilyDef {
  id: ScentFamily
  label: string
  labelEs: string
  color: string      // Primary accent color hex
  colorLight: string // Light bg hex
  colorDark: string  // Dark text hex
  emoji: string
}

export const SCENT_FAMILIES: ScentFamilyDef[] = [
  {
    id: "woody",
    label: "Woody",
    labelEs: "Amaderada",
    color: "#E85D3A",
    colorLight: "#FAEAE5",
    colorDark: "#993C1D",
    emoji: "🪵",
  },
  {
    id: "fresh",
    label: "Fresh",
    labelEs: "Fresca",
    color: "#2A7C6F",
    colorLight: "#E3F3F0",
    colorDark: "#1D5C53",
    emoji: "🌊",
  },
  {
    id: "floral",
    label: "Floral",
    labelEs: "Floral",
    color: "#C25D7B",
    colorLight: "#FBEDF1",
    colorDark: "#9E3D5C",
    emoji: "🌸",
  },
  {
    id: "oriental",
    label: "Oriental",
    labelEs: "Oriental",
    color: "#7B61C4",
    colorLight: "#EEEAFC",
    colorDark: "#5A419E",
    emoji: "✨",
  },
  {
    id: "green",
    label: "Green",
    labelEs: "Verde",
    color: "#5D9B4A",
    colorLight: "#E8F3E4",
    colorDark: "#3D7832",
    emoji: "🌿",
  },
  {
    id: "amber",
    label: "Amber",
    labelEs: "Ámbar",
    color: "#E8B94A",
    colorLight: "#FBF3E0",
    colorDark: "#C49A2E",
    emoji: "🍯",
  },
]

export function getScentFamily(id: string): ScentFamilyDef {
  return (
    SCENT_FAMILIES.find((f) => f.id === id) ?? SCENT_FAMILIES[0]
  )
}
