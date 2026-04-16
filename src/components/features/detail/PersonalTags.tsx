interface PersonalTagsProps {
  occasionTags: string[]
  seasonTags: string[]
  moodTags: string[]
}

function TagGroup({ label, tags }: { label: string; tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1 text-xs font-medium capitalize"
            style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export function PersonalTags({ occasionTags, seasonTags, moodTags }: PersonalTagsProps) {
  const hasAny = occasionTags.length > 0 || seasonTags.length > 0 || moodTags.length > 0
  if (!hasAny) return null

  return (
    <div className="space-y-4 px-5">
      <TagGroup label="Ocasión" tags={occasionTags} />
      <TagGroup label="Temporada" tags={seasonTags} />
      <TagGroup label="Estado de ánimo" tags={moodTags} />
    </div>
  )
}
