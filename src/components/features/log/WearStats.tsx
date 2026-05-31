import { isToday, isYesterday, format, getDay } from "date-fns"
import type { WearLog } from "@/types/recommendation"
import { getFragranceName, getFragranceFamily } from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"

interface WearStatsProps {
  logs: WearLog[]
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function relativeDate(worn_at: string): string {
  const d = new Date(worn_at)
  if (isToday(d)) return "Hoy"
  if (isYesterday(d)) return "Ayer"
  return format(d, "d MMM")
}

export function WearStats({ logs }: WearStatsProps) {
  if (logs.length === 0) return null

  const totalUses = logs.length

  const fragranceIds = new Set(logs.map((l) => l.user_fragrance_id))
  const distinctFragrances = fragranceIds.size

  // Most worn
  const countById: Record<string, { name: string; count: number }> = {}
  for (const log of logs) {
    if (!log.user_fragrance) continue
    const id = log.user_fragrance_id
    if (!countById[id]) countById[id] = { name: getFragranceName(log.user_fragrance), count: 0 }
    countById[id].count++
  }
  const topEntry = Object.values(countById).sort((a, b) => b.count - a.count)[0]

  // Favorite day of week
  const dayCount: Record<number, number> = {}
  for (const log of logs) {
    const d = getDay(new Date(log.worn_at))
    dayCount[d] = (dayCount[d] ?? 0) + 1
  }
  const favDayNum = Object.entries(dayCount).sort((a, b) => Number(b[1]) - Number(a[1]))[0]
  const favDay = favDayNum ? DAY_NAMES[Number(favDayNum[0])] : "—"

  const recentLogs = logs.slice(0, 6)

  return (
    <div className="px-5 space-y-5">
      {/* 2×2 stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[16px] p-4" style={{ backgroundColor: "var(--bg-surface)" }}>
          <p className="text-[10px] font-medium uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
            Usos este mes
          </p>
          <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}>
            {totalUses}
          </p>
        </div>

        <div className="rounded-[16px] p-4" style={{ backgroundColor: "var(--bg-surface)" }}>
          <p className="text-[10px] font-medium uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
            Fragancias usadas
          </p>
          <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}>
            {distinctFragrances}
          </p>
        </div>

        <div className="rounded-[16px] p-4" style={{ backgroundColor: "var(--bg-surface)" }}>
          <p className="text-[10px] font-medium uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
            Más llevada
          </p>
          {topEntry ? (
            <>
              <p className="text-sm font-semibold leading-snug truncate" style={{ color: "var(--text-primary)" }}>
                {topEntry.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--scent-accent)" }}>
                {topEntry.count} {topEntry.count === 1 ? "vez" : "veces"}
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>—</p>
          )}
        </div>

        <div className="rounded-[16px] p-4" style={{ backgroundColor: "var(--bg-surface)" }}>
          <p className="text-[10px] font-medium uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
            Día favorito
          </p>
          <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}>
            {favDay}
          </p>
        </div>
      </div>

      {/* Últimos usos */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
          Últimos usos
        </p>
        <div className="space-y-2">
          {recentLogs.map((log) => {
            const uf = log.user_fragrance
            const family = uf ? getFragranceFamily(uf) : null
            const familyDef = family ? getScentFamily(family) : null
            const name = uf ? getFragranceName(uf) : "Fragancia eliminada"
            const initial = name[0]?.toUpperCase() ?? "?"

            return (
              <div
                key={log.id}
                className="flex items-center gap-3 rounded-[12px] px-4 py-3"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: familyDef?.color ?? "var(--text-muted)" }}
                >
                  {initial}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {name}
                  </p>
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                  {relativeDate(log.worn_at)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
