"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { WeatherData } from "@/types/weather"

export async function logWear(params: {
  userFragranceId: string
  occasion: string | null
  mood: string | null
  weather: WeatherData | null
  aiRecommended: boolean
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) throw new Error("No autenticado")

  const { error } = await supabase.from("wear_logs").insert({
    user_id: session.user.id,
    user_fragrance_id: params.userFragranceId,
    occasion: params.occasion,
    mood: params.mood,
    weather_data: params.weather
      ? {
          temp: params.weather.temp,
          feels_like: params.weather.feels_like,
          condition: params.weather.condition,
          humidity: params.weather.humidity,
          description: params.weather.description,
        }
      : null,
    ai_recommended: params.aiRecommended,
  })

  if (error) throw new Error(error.message)

  revalidatePath("/log")
  revalidatePath("/today")
}
