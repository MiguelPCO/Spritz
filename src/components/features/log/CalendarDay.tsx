import { isToday } from "date-fns"
import type { WearLog } from "@/types/recommendation"
import { getFragranceFamily } from "@/types/fragrance"
import { getScentFamily } from "@/lib/constants/scentFamilies"

interface CalendarDayProps {
  date: Date
  logs: WearLog[]
  isCurrentMonth: boolean
}

export function CalendarDay({ date, logs, isCurrentMonth }: CalendarDayProps) {
  const today = isToday(date)
  const hasLogs = logs.length > 0

  // Use the most recent wear's family for the circle color
  const primaryLog = logs[0]
  const family = primaryLog?.user_fragrance
    ? getFragranceFamily(primaryLog.user_fragrance)
    : null
  const familyDef = family ? getScentFamily(family) : null

  return (
    <div className="flex flex-col items-center py-1.5">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors"
        style={
          hasLogs && familyDef
            ? {
                backgroundColor: familyDef.color,
                color: "white",
              }
            : today
            ? {
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                outline: "2px solid var(--scent-accent)",
                outlineOffset: "-2px",
              }
            : {
                backgroundColor: "transparent",
                color: isCurrentMonth ? "var(--text-primary)" : "var(--text-muted)",
                opacity: isCurrentMonth ? 1 : 0.4,
              }
        }
        aria-label={`${date.getDate()}: ${logs.length} uso${logs.length !== 1 ? "s" : ""}`}
      >
        {date.getDate()}
      </span>

      {/* Dot indicator for multiple wears */}
      {logs.length > 1 && (
        <span
          className="mt-0.5 h-1 w-1 rounded-full"
          style={{ backgroundColor: familyDef?.color ?? "var(--text-muted)" }}
        />
      )}
    </div>
  )
}
