import { NextRequest, NextResponse } from "next/server"
import { searchFragrances } from "@/lib/api/parfumo"
import type { FragranceCatalogResult } from "@/lib/api/parfumo"
import Anthropic from "@anthropic-ai/sdk"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { SCENT_FAMILIES } from "@/lib/constants/scentFamilies"

const VALID_FAMILIES = new Set<string>(SCENT_FAMILIES.map((f) => f.id))

// Singleton — avoids creating a new HTTP agent per request
const anthropicClient = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

function sanitizeFamily(f: unknown): string {
  return typeof f === "string" && VALID_FAMILIES.has(f) ? f : "woody"
}

async function aiFragranceLookup(query: string): Promise<FragranceCatalogResult[]> {
  if (!anthropicClient) return []

  try {
    const message = await anthropicClient.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: `Eres una base de datos experta en fragancias y perfumes.
Dado un texto de búsqueda, devuelve un array JSON de hasta 8 fragancias reales que coincidan DIRECTAMENTE con la consulta (misma marca, nombre o ingrediente principal).
NO incluyas fragancias de marcas o nombres distintos aunque sean del mismo estilo olfativo.
Si la consulta es un nombre de marca, devuelve SOLO fragancias de esa marca exacta.
Responde SOLO con JSON válido sin markdown.
Familias olfativas válidas: fresh, floral, oriental, woody, green, amber, citrica, fougere, chipre, gourmand, aromatica, acuatica, afrutada, cuero.
Formato exacto de cada objeto:
{"id":"ai-1","name":"Nombre","brand":"Marca","family":"familia","topNotes":["nota1","nota2"],"middleNotes":["nota1"],"baseNotes":["nota1"],"imageUrl":null,"description":"Descripción breve en español.","gender":"masculine|feminine|unisex","year":2010}
Si no hay ninguna fragancia real que coincida directamente, devuelve [].`,
      messages: [
        {
          role: "user",
          content: `Busca fragancias que coincidan DIRECTAMENTE con: "${query}"`,
        },
      ],
    })

    const textContent = message.content.find((c) => c.type === "text")
    if (!textContent || textContent.type !== "text") return []

    const raw = textContent.text.trim()
    const jsonMatch = raw.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []

    const parsed = JSON.parse(jsonMatch[0]) as unknown[]
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map((item, i) => ({
        id: `ai-${i + 1}`,
        name: String(item.name ?? ""),
        brand: String(item.brand ?? ""),
        family: sanitizeFamily(item.family),
        topNotes: Array.isArray(item.topNotes) ? (item.topNotes as string[]).map(String) : [],
        middleNotes: Array.isArray(item.middleNotes) ? (item.middleNotes as string[]).map(String) : [],
        baseNotes: Array.isArray(item.baseNotes) ? (item.baseNotes as string[]).map(String) : [],
        imageUrl: null,
        description: item.description ? String(item.description) : null,
        gender: item.gender ? String(item.gender) : null,
        year: item.year ? Number(item.year) : null,
      }))
      .filter((item) => item.name && item.brand)
  } catch {
    return []
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const q = request.nextUrl.searchParams.get("q") ?? ""
  if (!q.trim()) return NextResponse.json({ results: [], source: "seed" })
  if (q.length > 200) return NextResponse.json({ results: [], source: "empty" }, { status: 400 })

  const seedResults = await searchFragrances(q)

  if (seedResults.length > 0) {
    return NextResponse.json({ results: seedResults, source: "seed" })
  }

  // Seed returned nothing → AI fallback
  const aiResults = await aiFragranceLookup(q)
  return NextResponse.json({
    results: aiResults,
    source: aiResults.length > 0 ? "ai" : "empty",
  })
}
