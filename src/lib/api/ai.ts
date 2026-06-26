import Anthropic from "@anthropic-ai/sdk"
import type { AIPromptContext, AIRecommendationResponse } from "@/types/recommendation"
import { getTimeOfDayLabel } from "@/types/weather"

const MODEL = "claude-haiku-4-5-20251001"

// Singleton — avoids creating a new HTTP agent per request (#10)
const anthropicClient = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

export function sanitizeUserText(text: string, maxLen = 300): string {
  return text
    .replace(/[\n\r]/g, " ")
    .replace(/[|{}"]/g, "")
    .trim()
    .slice(0, maxLen)
}

function validateAndNormalize(
  parsed: AIRecommendationResponse,
  ctx: AIPromptContext
): AIRecommendationResponse {
  const exists = ctx.wardrobe.some((f) => f.id === parsed.fragranceId)
  const fragranceId = exists ? parsed.fragranceId : ctx.wardrobe[0].id
  const reason = parsed.reason ? String(parsed.reason).slice(0, 400) : "Una elección perfecta para el momento."
  return { fragranceId, reason }
}

function buildPrompt(ctx: AIPromptContext): string {
  const timeLabel = getTimeOfDayLabel(ctx.timeOfDay)

  const recentList =
    ctx.recentWears.length > 0
      ? ctx.recentWears
          .map((w) => `  - ${w.brand} ${w.fragranceName} (${w.wornAt})`)
          .join("\n")
      : "  - Sin usos recientes"

  const wardrobeList = ctx.wardrobe
    .map(
      (f) =>
        `  - ID:${f.id} | ${f.brand} ${f.name} | Familias:${(f.families ?? [f.family]).join(",")}` +
        (f.occasionTags.length > 0 ? ` | Ocasiones:${f.occasionTags.join(",")}` : "") +
        (f.moodTags.length > 0 ? ` | Estado:${f.moodTags.join(",")}` : "") +
        (f.topNotes.length > 0 ? ` | Notas:${f.topNotes.slice(0, 3).join(",")}` : "")
    )
    .join("\n")

  return `Selecciona UNA fragancia del armario del usuario para estas condiciones:

CONTEXTO:
- Tiempo: ${ctx.weather ? `${ctx.weather.temp}°C, ${ctx.weather.description}, humedad ${ctx.weather.humidity}%` : "Sin datos meteorológicos disponibles"}
- Momento del día: ${timeLabel}
- Ocasión: ${ctx.occasions.length > 0 ? ctx.occasions.join(", ") : "Sin especificar"}
- Estado de ánimo: ${ctx.moods.length > 0 ? ctx.moods.join(", ") : "Sin especificar"}${ctx.freeText ? `\n- Contexto adicional: ${sanitizeUserText(ctx.freeText)}` : ""}

USOS RECIENTES (evita repetir si es posible):
${recentList}

ARMARIO DISPONIBLE:
${wardrobeList}

Responde SOLO con JSON válido sin markdown, en este formato exacto:
{"fragranceId":"UUID_AQUI","reason":"RAZON_EN_ESPANOL_2_FRASES_MAX"}`
}

export async function generateRecommendation(
  ctx: AIPromptContext
): Promise<AIRecommendationResponse> {
  if (ctx.wardrobe.length === 0) {
    throw new Error("El armario está vacío")
  }

  if (!anthropicClient) throw new Error("ANTHROPIC_API_KEY no configurada")

  const message = await anthropicClient.messages.create({
    model: MODEL,
    max_tokens: 256,
    system:
      "Eres un experto en fragancias. Tu función es recomendar la fragancia perfecta del armario del usuario según su contexto actual. Responde siempre con JSON válido, sin markdown, sin texto adicional. La razón debe estar en español, ser natural y entusiasta, máximo 2 frases.",
    messages: [{ role: "user", content: buildPrompt(ctx) }],
  })

  const textContent = message.content.find((c) => c.type === "text")
  if (!textContent || textContent.type !== "text") {
    throw new Error("La IA no devolvió una respuesta de texto")
  }

  try {
    const parsed = JSON.parse(textContent.text) as AIRecommendationResponse
    if (!parsed.fragranceId || !parsed.reason) {
      throw new Error("Respuesta de IA con formato incorrecto")
    }
    return validateAndNormalize(parsed, ctx)
  } catch {
    // Parsing failed — try to extract JSON from response
    const jsonMatch = textContent.text.match(/\{[^}]+\}/)
    if (jsonMatch) {
      const fallback = JSON.parse(jsonMatch[0]) as AIRecommendationResponse
      return validateAndNormalize(fallback, ctx)
    }
    throw new Error("No se pudo parsear la respuesta de la IA")
  }
}
