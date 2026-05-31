export type ScentFamily =
  | "woody"
  | "fresh"
  | "floral"
  | "oriental"
  | "green"
  | "amber"
  | "citrica"
  | "fougere"
  | "chipre"
  | "gourmand"
  | "aromatica"
  | "acuatica"
  | "afrutada"
  | "cuero"

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
  {
    id: "citrica",
    label: "Citric",
    labelEs: "Cítrica",
    color: "#C8B000",
    colorLight: "#FBF6C0",
    colorDark: "#7A6B00",
    emoji: "🍋",
  },
  {
    id: "fougere",
    label: "Fougère",
    labelEs: "Fougère",
    color: "#3D6B5A",
    colorLight: "#DCF0E8",
    colorDark: "#1E4438",
    emoji: "🌿",
  },
  {
    id: "chipre",
    label: "Chypre",
    labelEs: "Chipré",
    color: "#6E7D3A",
    colorLight: "#EBF0DA",
    colorDark: "#465028",
    emoji: "🍃",
  },
  {
    id: "gourmand",
    label: "Gourmand",
    labelEs: "Gourmand",
    color: "#B5652A",
    colorLight: "#FAE8D8",
    colorDark: "#7A3F10",
    emoji: "🍰",
  },
  {
    id: "aromatica",
    label: "Aromatic",
    labelEs: "Aromática",
    color: "#7A6BAA",
    colorLight: "#EDE8F8",
    colorDark: "#50408A",
    emoji: "🌸",
  },
  {
    id: "acuatica",
    label: "Aquatic",
    labelEs: "Acuática",
    color: "#3B88C4",
    colorLight: "#DCF0FA",
    colorDark: "#1A5C90",
    emoji: "💧",
  },
  {
    id: "afrutada",
    label: "Fruity",
    labelEs: "Afrutada",
    color: "#D4774A",
    colorLight: "#FAE8DC",
    colorDark: "#9A4020",
    emoji: "🍑",
  },
  {
    id: "cuero",
    label: "Leather",
    labelEs: "Cuero",
    color: "#8B5E3C",
    colorLight: "#F0E4D8",
    colorDark: "#5A3420",
    emoji: "🫎",
  },
]

export function getScentFamily(id: string): ScentFamilyDef {
  return (
    SCENT_FAMILIES.find((f) => f.id === id) ?? SCENT_FAMILIES[0]
  )
}
