"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { WearCalendar } from "@/components/features/log/WearCalendar"
import { WearStats } from "@/components/features/log/WearStats"
import { useWearLog } from "@/lib/hooks/useWearLog"

export default function LogPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const { data: logs = [] } = useWearLog(year, month)

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <TopBar title="Registro de uso" />

      <div className="space-y-6 pb-6 pt-2">
        <WearCalendar
          year={year}
          month={month}
          logs={logs}
          onPrev={prevMonth}
          onNext={nextMonth}
        />

        {logs.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center px-5">
            <p className="text-2xl mb-2">📅</p>
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Sin registros este mes
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Usa una fragancia desde Hoy o desde el detalle para verla aquí
            </p>
          </div>
        ) : (
          <WearStats logs={logs} />
        )}
      </div>
    </div>
  )
}
