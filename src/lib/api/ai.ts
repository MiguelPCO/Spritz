import Anthropic from "@anthropic-ai/sdk"
import type { AIPromptContext, AIRecommendationResponse } from "@/types/recommendation"
import { getTimeOfDayLabel } from "@/types/weather"

const MODEL = "claude-haiku-4-5-20251001"

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
        `  - ID:${f.id} | ${f.brand} ${f.name} | Familia:${f.family}` +
        (f.occasionTags.length > 0 ? ` | Ocasiones:${f.occasionTags.join(",")}` : "") +
        (f.moodTags.length > 0 ? ` | Estado:${f.moodTags.join(",")}` : "") +
        (f.topNotes.length > 0 ? ` | Notas:${f.topNotes.slice(0, 3).join(",")}` : "")
    )
    .join("\n")

  return `Selecciona UNA fragancia del armario del usuario para estas condiciones:

CONTEXTO:
- Tiempo: ${ctx.weather.temp}°C, ${ctx.weather.description}, humedad ${ctx.weather.humidity}%
- Momento del día: ${timeLabel}
- Ocasión: ${ctx.occasion ?? "Sin especificar"}
- Estado de ánimo: ${ctx.moods.length > 0 ? ctx.moods.join(", ") : "Sin especificar"}

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

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const message = await client.messages.create({
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
    // Validate the returned fragranceId exists in the wardrobe
    const exists = ctx.wardrobe.some((f) => f.id === parsed.fragranceId)
    if (!exists) {
      // Fallback: return first fragrance in wardrobe
      return {
        fragranceId: ctx.wardrobe[0].id,
        reason: parsed.reason,
      }
    }
    return parsed
  } catch {
    // Parsing failed — try to extract JSON from response
    const jsonMatch = textContent.text.match(/\{[^}]+\}/)
    if (jsonMatch) {
      const fallback = JSON.parse(jsonMatch[0]) as AIRecommendationResponse
      return fallback
    }
    throw new Error("No se pudo parsear la respuesta de la IA")
  }
}
