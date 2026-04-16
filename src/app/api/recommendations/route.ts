import { NextResponse } from "next/server"
import { generateRecommendation } from "@/lib/api/ai"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { AIPromptContext, AIRecommendationResponse } from "@/types/recommendation"

/** Simple rule-based fallback when AI is unavailable */
function ruleBasedPick(ctx: AIPromptContext): AIRecommendationResponse | null {
  if (ctx.wardrobe.length === 0) return null

  const { temp } = ctx.weather
  const timeOfDay = ctx.timeOfDay

  // Score each fragrance by simple heuristics
  const scored = ctx.wardrobe.map((f) => {
    let score = 0
    const family = f.family.toLowerCase()

    // Temperature preference
    if (temp < 10 && (family === "oriental" || family === "woody" || family === "amber")) score += 3
    if (temp >= 10 && temp < 20 && (family === "woody" || family === "floral")) score += 2
    if (temp >= 20 && (family === "fresh" || family === "green")) score += 3

    // Time of day
    if (timeOfDay === "morning" && (family === "fresh" || family === "green")) score += 2
    if (timeOfDay === "evening" && (family === "oriental" || family === "woody" || family === "amber")) score += 2

    // Occasion match
    if (ctx.occasion && f.occasionTags.includes(ctx.occasion)) score += 3

    // Mood match (any of selected moods)
    if (ctx.moods.length > 0 && ctx.moods.some((m) => f.moodTags.includes(m))) score += 3

    return { f, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const pick = scored[0].f

  const reasons: Record<string, string> = {
    fresh: "Perfecta para hoy con su frescura y ligereza.",
    floral: "Sus notas florales encajan a la perfección con el momento.",
    woody: "Su carácter amaderado es ideal para la ocasión.",
    oriental: "Sus notas cálidas y envolventes son perfectas ahora.",
    green: "Su frescura verde es justo lo que necesitas hoy.",
    amber: "Su calidez ambarada complementa perfectamente el día.",
  }

  return {
    fragranceId: pick.id,
    reason: reasons[pick.family] ?? "Una elección perfecta para el momento.",
  }
}

export async function POST(request: Request) {
  // Verify auth
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: Partial<AIPromptContext>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body.wardrobe || body.wardrobe.length === 0) {
    return NextResponse.json(
      { error: "El armario está vacío. Añade fragancias primero." },
      { status: 400 }
    )
  }

  if (!body.weather || !body.timeOfDay) {
    return NextResponse.json(
      { error: "Se requieren datos de tiempo y momento del día" },
      { status: 400 }
    )
  }

  const ctx: AIPromptContext = {
    weather: body.weather,
    timeOfDay: body.timeOfDay,
    occasion: body.occasion ?? null,
    moods: body.moods ?? [],
    recentWears: body.recentWears ?? [],
    wardrobe: body.wardrobe,
  }

  try {
    const recommendation = await generateRecommendation(ctx)
    return NextResponse.json(recommendation)
  } catch (err) {
    console.error("[/api/recommendations] Error:", err)

    // If AI fails (billing, network, etc.) return a rule-based fallback
    // so the app stays functional
    const fallback = ruleBasedPick(ctx)
    if (fallback) {
      return NextResponse.json(fallback)
    }

    const message = err instanceof Error ? err.message : "Error generando recomendación"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
