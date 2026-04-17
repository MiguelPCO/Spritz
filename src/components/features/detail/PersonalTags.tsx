import { OCCASIONS } from "@/lib/constants/occasions"
import { MOODS } from "@/lib/constants/moods"

const SEASONS = [
  { id: "spring", label: "Primavera", icon: "🌸" },
  { id: "summer", label: "Verano",    icon: "☀️" },
  { id: "autumn", label: "Otoño",     icon: "🍂" },
  { id: "winter", label: "Invierno",  icon: "❄️" },
]

const OCCASION_MAP = Object.fromEntries(OCCASIONS.map((o) => [o.id, { label: o.label, icon: o.icon }]))
const SEASON_MAP   = Object.fromEntries(SEASONS.map((s)   => [s.id, { label: s.label, icon: s.icon }]))
const MOOD_MAP     = Object.fromEntries(MOODS.map((m)     => [m.id, { label: m.label, icon: m.icon }]))

interface PersonalTagsProps {
  occasionTags: string[]
  seasonTags: string[]
  moodTags: string[]
}

function TagGroup({
  label,
  tags,
  lookup,
}: {
  label: string
  tags: string[]
  lookup: Record<string, { label: string; icon: string }>
}) {
  if (tags.length === 0) return null
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const entry = lookup[tag]
          return (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
            >
              {entry?.icon && <span>{entry.icon}</span>}
              <span>{entry?.label ?? tag}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function PersonalTags({ occasionTags, seasonTags, moodTags }: PersonalTagsProps) {
  const hasAny = occasionTags.length > 0 || seasonTags.length > 0 || moodTags.length > 0
  if (!hasAny) return null

  return (
    <div className="space-y-4 px-5">
      <TagGroup label="Ocasión"         tags={occasionTags} lookup={OCCASION_MAP} />
      <TagGroup label="Temporada"       tags={seasonTags}   lookup={SEASON_MAP}   />
      <TagGroup label="Estado de ánimo" tags={moodTags}     lookup={MOOD_MAP}     />
    </div>
  )
}
