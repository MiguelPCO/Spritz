"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  format,
  getDay,
  isSameDay,
} from "date-fns"
import { getMonthLabel } from "@/lib/utils/dateUtils"
import { CalendarDay } from "./CalendarDay"
import type { WearLog } from "@/types/recommendation"
import { useWearLog } from "@/lib/hooks/useWearLog"

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"]

export function WearCalendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const { data: logs = [] } = useWearLog(year, month)

  const days = eachDayOfInterval({
    start: startOfMonth(new Date(year, month)),
    end: endOfMonth(new Date(year, month)),
  })

  // Build lookup: ISO date string → logs[]
  const logsByDate = logs.reduce<Record<string, WearLog[]>>((acc, log) => {
    const key = format(new Date(log.worn_at), "yyyy-MM-dd")
    acc[key] = [...(acc[key] ?? []), log]
    return acc
  }, {})

  // Padding for first day of week (Monday = 0)
  const firstDayOfWeek = (getDay(days[0]) + 6) % 7 // convert Sunday=0 to Mon-based

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="px-5">
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} aria-label="Mes anterior">
          <ChevronLeft size={20} style={{ color: "var(--text-secondary)" }} />
        </button>
        <h2
          className="text-base font-semibold capitalize"
          style={{ fontFamily: "var(--font-jakarta)", color: "var(--text-primary)" }}
        >
          {getMonthLabel(year, month)}
        </h2>
        <button onClick={nextMonth} aria-label="Mes siguiente">
          <ChevronRight size={20} style={{ color: "var(--text-secondary)" }} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[11px] font-medium"
            style={{ color: "var(--text-muted)" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {/* Empty cells for first week padding */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd")
          return (
            <CalendarDay
              key={key}
              date={day}
              logs={logsByDate[key] ?? []}
              isCurrentMonth
            />
          )
        })}
      </div>

      {/* Legend */}
      {logs.length > 0 && (
        <p className="mt-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
          {logs.length} uso{logs.length !== 1 ? "s" : ""} este mes
        </p>
      )}
    </div>
  )
}
