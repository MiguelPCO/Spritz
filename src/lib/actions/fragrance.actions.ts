"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { FragranceCatalogResult } from "@/lib/api/parfumo"

interface AddToWardrobeParams {
  catalogResult?: FragranceCatalogResult
  customName?: string
  customBrand?: string
  customFamilies?: string[]
  customImageUrl?: string   // URL pasted in ManualEntryForm
  customTopNotes?: string[]
  customMiddleNotes?: string[]
  customBaseNotes?: string[]
  personalNotes?: string
  photoUrl?: string         // User-uploaded photo via Supabase Storage
  occasionTags?: string[]
  seasonTags?: string[]
  moodTags?: string[]
  status?: "active" | "empty" | "wishlist" | "sold"
  priceTarget?: number | null
}

export async function addToWardrobe(params: AddToWardrobeParams) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("No autenticado")

  let fragranceId: string | null = null

  // Upsert catalog fragrance atomically (avoids TOCTOU race on external_id)
  if (params.catalogResult) {
    const cat = params.catalogResult
    const { data: upserted, error } = await supabase
      .from("fragrances")
      .upsert(
        {
          name: cat.name,
          brand: cat.brand,
          family: cat.family,
          top_notes: cat.topNotes,
          middle_notes: cat.middleNotes,
          base_notes: cat.baseNotes,
          description: cat.description,
          image_url: cat.imageUrl,
          external_id: cat.id,
          gender: cat.gender,
          year_released: cat.year,
        },
        { onConflict: "external_id", ignoreDuplicates: false }
      )
      .select("id")
      .single()

    if (error) throw new Error(error.message)
    fragranceId = upserted.id
  }

  // Build custom_notes for manual entries
  const hasCustomNotes =
    (params.customTopNotes?.length ?? 0) > 0 ||
    (params.customMiddleNotes?.length ?? 0) > 0 ||
    (params.customBaseNotes?.length ?? 0) > 0
  const customNotes = hasCustomNotes
    ? {
        top: params.customTopNotes ?? [],
        middle: params.customMiddleNotes ?? [],
        base: params.customBaseNotes ?? [],
      }
    : null

  // photo_url: prefer uploaded photo, fall back to URL pasted in manual entry
  const photoUrl = params.photoUrl ?? params.customImageUrl ?? null

  // Insert user_fragrance
  const { error } = await supabase.from("user_fragrances").insert({
    user_id: session.user.id,
    fragrance_id: fragranceId,
    custom_name: params.customName ?? null,
    custom_brand: params.customBrand ?? null,
    custom_families: params.customFamilies ?? [],
    custom_notes: customNotes,
    photo_url: photoUrl,
    personal_notes: params.personalNotes ?? null,
    occasion_tags: params.occasionTags ?? [],
    season_tags: params.seasonTags ?? [],
    mood_tags: params.moodTags ?? [],
    status: params.status ?? "active",
    price_target: params.priceTarget ?? null,
  })

  if (error) {
    // 23505 = unique_violation. Only relevant for catalog fragrances (fragrance_id NOT NULL).
    // Manual entries (fragrance_id NULL) should never trigger this unless DB constraint
    // was set up with NULLS NOT DISTINCT — fix that with the SQL below.
    if (error.code === "23505" && fragranceId) {
      throw new Error("Ya tienes esta fragancia en tu colección")
    }
    throw new Error(error.message)
  }

  revalidatePath("/wardrobe")
  revalidatePath("/discover")
}

export async function updateFragrance(
  id: string,
  updates: {
    personalNotes?: string
    occasionTags?: string[]
    seasonTags?: string[]
    moodTags?: string[]
    status?: string
    mlRemaining?: number | null
    photoUrl?: string | null
    priceTarget?: number | null
    wishlistPosition?: number | null
    // Manual entry fields
    customName?: string
    customBrand?: string
    customFamilies?: string[]
    customNotes?: { top: string[]; middle: string[]; base: string[] } | null
  }
) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("No autenticado")

  const { error } = await supabase
    .from("user_fragrances")
    .update({
      personal_notes: updates.personalNotes,
      occasion_tags: updates.occasionTags,
      season_tags: updates.seasonTags,
      mood_tags: updates.moodTags,
      status: updates.status,
      ml_remaining: updates.mlRemaining,
      photo_url: updates.photoUrl,
      price_target: updates.priceTarget,
      wishlist_position: updates.wishlistPosition,
      ...(updates.customName !== undefined && { custom_name: updates.customName }),
      ...(updates.customBrand !== undefined && { custom_brand: updates.customBrand }),
      ...(updates.customFamilies !== undefined && { custom_families: updates.customFamilies }),
      ...(updates.customNotes !== undefined && { custom_notes: updates.customNotes }),
    })
    .eq("id", id)
    .eq("user_id", session.user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/wardrobe")
}

export async function updateWishlistPositions(
  positions: Array<{ id: string; position: number }>
) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("No autenticado")

  const results = await Promise.all(
    positions.map(({ id, position }) =>
      supabase
        .from("user_fragrances")
        .update({ wishlist_position: position })
        .eq("id", id)
        .eq("user_id", session.user.id)
    )
  )
  const failed = results.filter((r) => r.error)
  if (failed.length > 0) throw new Error(failed[0].error!.message)
  revalidatePath("/discover")
}

export async function deleteFragrance(id: string) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("No autenticado")

  const { error } = await supabase
    .from("user_fragrances")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/wardrobe")
  revalidatePath("/discover")
}
