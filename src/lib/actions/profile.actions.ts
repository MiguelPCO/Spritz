"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(updates: { displayName: string }) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("No autenticado")

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: updates.displayName.trim() || null })
    .eq("id", session.user.id)

  if (error) throw new Error(error.message)
  revalidatePath("/profile")
}
