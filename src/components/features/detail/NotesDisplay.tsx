interface NotesDisplayProps {
  topNotes: string[]
  middleNotes: string[]
  baseNotes: string[]
}

interface NoteRowProps {
  label: string
  notes: string[]
  size?: "sm" | "md" | "lg"
}

function NoteRow({ label, notes, size = "md" }: NoteRowProps) {
  if (notes.length === 0) return null
  const dotSize = size === "lg" ? "h-3 w-3" : size === "md" ? "h-2.5 w-2.5" : "h-2 w-2"

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className={`rounded-full ${dotSize}`}
        style={{ backgroundColor: "var(--scent-accent)" }}
      />
      <p className="text-xs font-medium uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {notes.map((note) => (
          <span
            key={note}
            className="rounded-full px-2.5 py-1 text-xs"
            style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
          >
            {note}
          </span>
        ))}
      </div>
    </div>
  )
}

export function NotesDisplay({ topNotes, middleNotes, baseNotes }: NotesDisplayProps) {
  const hasNotes = topNotes.length > 0 || middleNotes.length > 0 || baseNotes.length > 0
  if (!hasNotes) return null

  return (
    <div className="px-5">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}>
        Pirámide olfativa
      </p>
      <div className="flex flex-col gap-5">
        <NoteRow label="Salida" notes={topNotes} size="sm" />
        <NoteRow label="Corazón" notes={middleNotes} size="md" />
        <NoteRow label="Fondo" notes={baseNotes} size="lg" />
      </div>
    </div>
  )
}
