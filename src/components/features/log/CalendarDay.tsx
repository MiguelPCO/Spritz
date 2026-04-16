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
  const visibleLogs = logs.slice(0, 3)
  const extraCount = logs.length - 3

  return (
    <div
      className="flex flex-col items-center gap-1 py-2"
      aria-label={`${date.getDate()}: ${logs.length} uso${logs.length !== 1 ? "s" : ""}`}
    >
      {/* Day number */}
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium"
        style={{
          backgroundColor: today ? "var(--scent-accent)" : "transparent",
          color: today
            ? "white"
            : isCurrentMonth
            ? "var(--text-primary)"
            : "var(--text-muted)",
        }}
      >
        {date.getDate()}
      </span>

      {/* Dots */}
      <div className="flex gap-0.5 min-h-[8px]">
        {visibleLogs.map((log, i) => {
          const family = log.user_fragrance
            ? getFragranceFamily(log.user_fragrance)
            : "woody"
          const familyDef = getScentFamily(family)
          return (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: familyDef.color }}
              title={log.user_fragrance
                ? `${log.user_fragrance.fragrance?.name ?? log.user_fragrance.custom_name ?? "?"}`
                : ""}
            />
          )
        })}
        {extraCount > 0 && hasLogs && (
          <span
            className="text-[9px] font-medium leading-none"
            style={{ color: "var(--text-muted)" }}
          >
            +{extraCount}
          </span>
        )}
      </div>
    </div>
  )
}
