"use client"

import { useState } from "react"
import { SCENT_FAMILIES } from "@/lib/constants/scentFamilies"
import type { ScentFamily } from "@/lib/constants/scentFamilies"
import { useAddFragranceStore } from "@/lib/stores/addFragranceStore"

const BRAND_SUGGESTIONS = [
  "Chanel", "Dior", "Tom Ford", "Yves Saint Laurent", "Givenchy",
  "Prada", "Gucci", "Armani", "Versace", "Valentino",
  "Hermès", "Burberry", "Hugo Boss", "Calvin Klein", "Dolce & Gabbana",
  "Creed", "Jo Malone", "Byredo", "Maison Margiela", "Diptyque",
  "Le Labo", "Acqua di Parma", "Montblanc", "Davidoff", "Lacoste",
  "Issey Miyake", "Thierry Mugler", "Jean Paul Gaultier", "Viktor & Rolf",
  "Narciso Rodriguez", "Marc Jacobs", "Rabanne", "Lancome", "Cartier",
  "Bulgari", "Azzaro", "Dunhill", "Jil Sander", "Escada",
  "Serge Lutens", "Parfums de Marly", "Amouage", "Memo Paris", "Initio",
]

const FIELDS = [
  { id: "name",     label: "Nombre *",               placeholder: "Ej. Bleu de Chanel" },
  { id: "brand",    label: "Marca *",                 placeholder: "Ej. Chanel", listId: "brand-suggestions" },
  { id: "top",      label: "Notas de salida",         placeholder: "Limón, Bergamota (separadas por coma)" },
  { id: "mid",      label: "Notas de corazón",        placeholder: "Jazmín, Rosa" },
  { id: "base",     label: "Notas de fondo",          placeholder: "Vainilla, Sándalo" },
  { id: "imageUrl", label: "URL de imagen (opcional)", placeholder: "https://... (pega el enlace de una foto)" },
]

export function ManualEntryForm() {
  const { updateDraft, setStep } = useAddFragranceStore()
  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [family, setFamily] = useState<ScentFamily>("woody")
  const [topNotes, setTopNotes] = useState("")
  const [middleNotes, setMiddleNotes] = useState("")
  const [baseNotes, setBaseNotes] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const values: Record<string, string> = { name, brand, top: topNotes, mid: middleNotes, base: baseNotes, imageUrl }
  const setters: Record<string, (v: string) => void> = {
    name: setName, brand: setBrand, top: setTopNotes,
    mid: setMiddleNotes, base: setBaseNotes, imageUrl: setImageUrl,
  }

  function handleNext() {
    if (!name.trim() || !brand.trim()) return
    updateDraft({
      name,
      brand,
      family,
      imageUrl: imageUrl.trim() || undefined,
      topNotes: topNotes ? topNotes.split(",").map((n) => n.trim()).filter(Boolean) : [],
      middleNotes: middleNotes ? middleNotes.split(",").map((n) => n.trim()).filter(Boolean) : [],
      baseNotes: baseNotes ? baseNotes.split(",").map((n) => n.trim()).filter(Boolean) : [],
    })
    setStep("tags")
  }

  return (
    <div className="space-y-4">
      <div>
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
        >
          Añadir manualmente
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Rellena los datos de tu fragancia
        </p>
      </div>

      {/* Brand datalist */}
      <datalist id="brand-suggestions">
        {BRAND_SUGGESTIONS.map((b) => <option key={b} value={b} />)}
      </datalist>

      {FIELDS.map((field) => (
        <div key={field.id} className="space-y-1">
          <label
            htmlFor={field.id}
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {field.label}
          </label>
          <input
            id={field.id}
            value={values[field.id]}
            onChange={(e) => setters[field.id](e.target.value)}
            placeholder={field.placeholder}
            list={field.listId}
            className="h-11 w-full rounded-[12px] border px-4 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      ))}

      {/* Family selector */}
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Familia olfativa
        </p>
        <div className="flex flex-wrap gap-2">
          {SCENT_FAMILIES.map((f) => (
            <button
              key={f.id}
              onClick={() => setFamily(f.id)}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: family === f.id ? f.color : "var(--bg-surface)",
                color: family === f.id ? "white" : "var(--text-secondary)",
              }}
            >
              {f.emoji} {f.labelEs}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep("search")}
          className="h-11 flex-1 rounded-[12px] text-sm font-medium"
          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
        >
          Volver
        </button>
        <button
          onClick={handleNext}
          disabled={!name.trim() || !brand.trim()}
          className="h-11 flex-1 rounded-[12px] text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--scent-accent)" }}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
