"use client"

import { TopBar } from "@/components/layout/TopBar"
import { WearCalendar } from "@/components/features/log/WearCalendar"
import { WearStats } from "@/components/features/log/WearStats"
import { useWearLog } from "@/lib/hooks/useWearLog"

export default function LogPage() {
  const now = new Date()
  const { data: logs = [] } = useWearLog(now.getFullYear(), now.getMonth())

  return (
    <div style={{ backgroundColor: "var(--bg-page)" }}>
      <TopBar title="Registro de uso" />

      <div className="space-y-6 pb-6">
        <WearCalendar />

        {logs.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center px-5">
            <p className="text-2xl mb-2">📅</p>
            <p className="font-semibold mb-1" style={{ fontFamily: "var(--font-jakarta)" }}>
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
