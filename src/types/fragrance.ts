import type { ScentFamily } from "@/lib/constants/scentFamilies"

export type { ScentFamily }

export type FragranceStatus = "active" | "empty" | "wishlist" | "sold"
export type FragranceGender = "masculine" | "feminine" | "unisex"
export type FragranceConcentration =
  | "EDT"
  | "EDP"
  | "parfum"
  | "cologne"
  | "mist"

/** A fragrance entry in the public catalog */
export interface Fragrance {
  id: string
  name: string
  brand: string
  family: ScentFamily
  top_notes: string[]
  middle_notes: string[]
  base_notes: string[]
  description: string | null
  image_url: string | null
  external_id: string | null
  gender: FragranceGender | null
  concentration: FragranceConcentration | null
  year_released: number | null
  created_at: string
}

/** A fragrance in the user's personal wardrobe */
export interface UserFragrance {
  id: string
  user_id: string
  fragrance_id: string | null
  fragrance: Fragrance | null     // joined from catalog (null for manual entries)

  // Manual entry override fields (used when fragrance_id is null)
  custom_name: string | null
  custom_brand: string | null
  custom_family: ScentFamily | null
  custom_notes: {
    top: string[]
    middle: string[]
    base: string[]
  } | null

  // Personal fields
  photo_url: string | null
  personal_notes: string | null
  status: FragranceStatus
  ml_remaining: number | null
  purchase_date: string | null
  purchase_price: number | null
  wishlist_position: number | null
  price_target: number | null

  // Personal tags
  occasion_tags: string[]
  season_tags: string[]
  mood_tags: string[]

  date_added: string
  updated_at: string
}

/** Derived helper — get the display name regardless of source */
export function getFragranceName(uf: UserFragrance): string {
  return uf.fragrance?.name ?? uf.custom_name ?? "Sin nombre"
}

export function getFragranceBrand(uf: UserFragrance): string {
  return uf.fragrance?.brand ?? uf.custom_brand ?? ""
}

export function getFragranceFamily(uf: UserFragrance): ScentFamily {
  return uf.fragrance?.family ?? uf.custom_family ?? "woody"
}

export function getFragranceImageUrl(uf: UserFragrance): string | null {
  return uf.photo_url ?? uf.fragrance?.image_url ?? null
}
