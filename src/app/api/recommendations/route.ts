import { NextResponse } from "next/server"
import { generateRecommendation } from "@/lib/api/ai"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getFragranceFamilies } from "@/types/fragrance"
import { getTimeOfDay } from "@/types/weather"
import type { AIPromptContext, AIRecommendationResponse } from "@/types/recommendation"
import type { WeatherData } from "@/types/weather"
import type { UserFragrance } from "@/types/fragrance"

/** Fields accepted from the client — wardrobe is always fetched server-side */
interface ClientPayload {
  weather?: WeatherData
  occasions?: string[]
  moods?: string[]
  freeText?: string
  recentWears?: Array<{ fragranceName: string; brand: string; wornAt: string }>
}

function sanitizeText(text: string, maxLen = 100): string {
  return text.replace(/[\n\r|{}"]/g, " ").trim().slice(0, maxLen)
}

/** Simple rule-based fallback when AI is unavailable */
function ruleBasedPick(ctx: AIPromptContext): AIRecommendationResponse | null {
  if (ctx.wardrobe.length === 0) return null

  const temp = ctx.weather?.temp ?? 15
  const timeOfDay = ctx.timeOfDay

  const scored = ctx.wardrobe.map((f) => {
    let score = 0
    const fams = f.families ?? [f.family]

    const hasFamily = (...ids: string[]) => ids.some((id) => fams.includes(id))

    if (temp < 10 && hasFamily("oriental", "woody", "amber", "gourmand", "cuero")) score += 3
    if (temp >= 10 && temp < 20 && hasFamily("woody", "floral", "fougere", "chipre", "aromatica")) score += 2
    if (temp >= 20 && hasFamily("fresh", "green", "citrica", "acuatica", "afrutada")) score += 3

    if (timeOfDay === "morning" && hasFamily("fresh", "green", "citrica", "acuatica")) score += 2
    if (timeOfDay === "evening" && hasFamily("oriental", "woody", "amber", "gourmand", "cuero")) score += 2

    if (ctx.occasions.length > 0 && ctx.occasions.some((o) => f.occasionTags.includes(o))) score += 3
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
    citrica: "Sus notas cítricas aportan la energía perfecta para el momento.",
    fougere: "Su perfil herbáceo y elegante encaja a la perfección.",
    chipre: "Su sofisticación chiprada es ideal para la ocasión.",
    gourmand: "Sus notas golosas y cálidas son perfectas para el momento.",
    aromatica: "Su frescura aromática es justo lo que necesitas ahora.",
    acuatica: "Sus notas acuáticas aportan ligereza y frescura.",
    afrutada: "Sus notas afrutadas añaden vitalidad al momento.",
    cuero: "Su carácter cuero transmite confianza y distinción.",
  }

  const primaryFamily = (pick.families ?? [pick.family])[0] ?? pick.family
  return {
    fragranceId: pick.id,
    reason: reasons[primaryFamily] ?? "Una elección perfecta para el momento.",
  }
}

function buildWardrobeEntry(uf: UserFragrance): AIPromptContext["wardrobe"][number] {
  const families = getFragranceFamilies(uf)
  // Sanitize custom fields before they reach the AI prompt (#9)
  const name = uf.fragrance?.name ?? sanitizeText(uf.custom_name ?? "", 80)
  const brand = uf.fragrance?.brand ?? sanitizeText(uf.custom_brand ?? "", 80)
  return {
    id: uf.id,
    name,
    brand,
    family: families[0],
    families,
    occasionTags: uf.occasion_tags,
    moodTags: uf.mood_tags,
    topNotes: uf.fragrance?.top_notes ?? [],
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: ClientPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Fetch wardrobe server-side — never trust client-provided fragrance data
  const { data: wardrobeRows, error: wardrobeError } = await supabase
    .from("user_fragrances")
    .select("*, fragrance:fragrances (*)")
    .eq("user_id", session.user.id)
    .eq("status", "active")

  if (wardrobeError) {
    return NextResponse.json({ error: "Error al obtener el armario" }, { status: 500 })
  }

  const wardrobe = (wardrobeRows ?? [] as unknown[]).map((row) =>
    buildWardrobeEntry(row as unknown as UserFragrance)
  )

  if (wardrobe.length === 0) {
    return NextResponse.json(
      { error: "El armario está vacío. Añade fragancias primero." },
      { status: 400 }
    )
  }

  const ctx: AIPromptContext = {
    weather: body.weather,
    timeOfDay: getTimeOfDay(),
    occasions: Array.isArray(body.occasions) ? body.occasions.map(String).slice(0, 10) : [],
    moods: Array.isArray(body.moods) ? body.moods.map(String).slice(0, 10) : [],
    freeText: body.freeText ? sanitizeText(body.freeText, 300) : undefined,
    recentWears: Array.isArray(body.recentWears) ? body.recentWears.slice(0, 20) : [],
    wardrobe,
  }

  try {
    const recommendation = await generateRecommendation(ctx)
    return NextResponse.json(recommendation)
  } catch (err) {
    console.error("[/api/recommendations] Error:", err)

    const fallback = ruleBasedPick(ctx)
    if (fallback) {
      return NextResponse.json(fallback)
    }

    const message = err instanceof Error ? err.message : "Error generando recomendación"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
