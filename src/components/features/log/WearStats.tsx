import type { WearLog } from "@/types/recommendation"
import { getFragranceName, getFragranceBrand } from "@/types/fragrance"

interface WearStatsProps {
  logs: WearLog[]
}

export function WearStats({ logs }: WearStatsProps) {
  if (logs.length === 0) return null

  // Compute most used
  const countById: Record<string, { name: string; brand: string; count: number }> = {}
  for (const log of logs) {
    if (!log.user_fragrance) continue
    const id = log.user_fragrance_id
    if (!countById[id]) {
      countById[id] = {
        name: getFragranceName(log.user_fragrance),
        brand: getFragranceBrand(log.user_fragrance),
        count: 0,
      }
    }
    countById[id].count++
  }

  const sorted = Object.values(countById).sort((a, b) => b.count - a.count)
  const top3 = sorted.slice(0, 3)

  return (
    <div className="px-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}>
        Más usadas este mes
      </p>
      <div className="space-y-2">
        {top3.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-[12px] px-4 py-3"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {item.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {item.brand}
              </p>
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--scent-accent)" }}
            >
              {item.count}×
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
