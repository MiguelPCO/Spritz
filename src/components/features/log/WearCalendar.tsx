"use client"

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

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"]

interface WearCalendarProps {
  year: number
  month: number
  logs: WearLog[]
  onPrev: () => void
  onNext: () => void
}

export function WearCalendar({ year, month, logs, onPrev, onNext }: WearCalendarProps) {
  const days = eachDayOfInterval({
    start: startOfMonth(new Date(year, month)),
    end: endOfMonth(new Date(year, month)),
  })

  const logsByDate = logs.reduce<Record<string, WearLog[]>>((acc, log) => {
    const key = format(new Date(log.worn_at), "yyyy-MM-dd")
    acc[key] = [...(acc[key] ?? []), log]
    return acc
  }, {})

  const firstDayOfWeek = (getDay(days[0]) + 6) % 7

  return (
    <div
      className="mx-5 rounded-[20px] p-4"
      style={{ backgroundColor: "var(--bg-surface)" }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2
          className="text-base font-semibold capitalize"
          style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
        >
          {getMonthLabel(year, month)}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Mes anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onNext}
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Mes siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[11px] font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
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
    </div>
  )
}
