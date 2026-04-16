import { BottomNav } from "./BottomNav"

interface AppShellProps {
  children: React.ReactNode
  topBar?: React.ReactNode
}

export function AppShell({ children, topBar }: AppShellProps) {
  return (
    <div className="app-shell">
      {topBar}
      {/* Main scrollable content area — padded for bottom nav (80px) */}
      <main className="min-h-dvh pb-24 pt-0">{children}</main>
      <BottomNav />
    </div>
  )
}
