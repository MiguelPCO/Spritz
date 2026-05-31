"use client"

import { useState } from "react"
import { getScentFamily } from "@/lib/constants/scentFamilies"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import type { FragranceCatalogResult } from "@/lib/api/parfumo"

interface CatalogFragranceCardProps {
  result: FragranceCatalogResult
  onAdd: (result: FragranceCatalogResult) => void
  isAdding?: boolean
  isOwned?: boolean
}

function NoteGroup({ label, notes }: { label: string; notes: string[] }) {
  if (notes.length === 0) return null
  return (
    <div>
      <p className="mb-1 text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {notes.map((n) => (
          <span
            key={n}
            className="rounded-full px-2.5 py-0.5 text-xs"
            style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

export function CatalogFragranceCard({ result, onAdd, isAdding, isOwned }: CatalogFragranceCardProps) {
  const [open, setOpen] = useState(false)
  const [imgError, setImgError] = useState(false)
  const rFamily = getScentFamily(result.family)

  const showImage = result.imageUrl && !imgError

  return (
    <>
      {/* Card row */}
      <div
        data-scent={result.family}
        className="flex items-center gap-3 rounded-[12px] px-4 py-3"
        style={{ backgroundColor: "var(--bg-surface)", opacity: isOwned ? 0.65 : 1 }}
      >
        {/* Thumbnail — clickable to open drawer */}
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-[10px] overflow-hidden"
          style={{ backgroundColor: "var(--scent-accent-light)" }}
          aria-label={`Ver detalles de ${result.name}`}
        >
          {showImage ? (
            <img
              src={result.imageUrl!}
              alt={result.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-xl select-none">{rFamily.emoji}</span>
          )}
        </button>

        {/* Info — clickable to open drawer */}
        <button onClick={() => setOpen(true)} className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
            {result.name}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
            {result.brand} · {rFamily.labelEs}
          </p>
        </button>

        {/* Action button */}
        {isOwned ? (
          <span className="shrink-0 text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
            En colección
          </span>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(result) }}
            disabled={isAdding}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "var(--scent-accent-light)", color: "var(--scent-accent)" }}
          >
            + Deseos
          </button>
        )}
      </div>

      {/* Detail drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          className="max-h-[85vh]"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div className="overflow-y-auto">
            {/* Hero image or emoji */}
            <div
              data-scent={result.family}
              className="flex items-center justify-center"
              style={{ backgroundColor: "var(--scent-accent-light)", height: showImage ? "200px" : "120px" }}
            >
              {showImage ? (
                <img
                  src={result.imageUrl!}
                  alt={result.name}
                  width={400}
                  height={200}
                  className="h-full w-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-6xl select-none">{rFamily.emoji}</span>
              )}
            </div>

            <DrawerHeader className="pt-4 pb-2">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <DrawerTitle
                    className="text-xl font-light leading-tight"
                    style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
                  >
                    {result.name}
                  </DrawerTitle>
                  <p className="mt-0.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {result.brand}
                  </p>
                </div>
                <span
                  className="mt-1 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest"
                  style={{ backgroundColor: "var(--scent-accent-light)", color: "var(--scent-accent)" }}
                >
                  {rFamily.emoji} {rFamily.labelEs}
                </span>
              </div>
            </DrawerHeader>

            <div className="space-y-4 px-4 pb-2">
              {result.description && (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {result.description}
                </p>
              )}

              <NoteGroup label="Notas de salida" notes={result.topNotes} />
              <NoteGroup label="Notas de corazón" notes={result.middleNotes} />
              <NoteGroup label="Notas de fondo" notes={result.baseNotes} />
            </div>

            <DrawerFooter className="pt-2 pb-8">
              {isOwned ? (
                <div
                  className="rounded-[14px] py-3 text-center text-sm font-medium"
                  style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
                >
                  Ya en tu colección
                </div>
              ) : (
                <button
                  onClick={() => { onAdd(result); setOpen(false) }}
                  disabled={isAdding}
                  className="rounded-[14px] py-3 text-sm font-medium transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: "var(--scent-accent)", color: "white" }}
                >
                  Añadir a lista de deseos
                </button>
              )}
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
