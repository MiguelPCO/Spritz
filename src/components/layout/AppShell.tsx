import { BottomNav } from "./BottomNav"
import { DesktopNav } from "./DesktopNav"

interface AppShellProps {
  children: React.ReactNode
  topBar?: React.ReactNode
}

export function AppShell({ children, topBar }: AppShellProps) {
  return (
    <div className="app-shell">
      <DesktopNav />
      {topBar}
      {/* pb-24: space for fixed BottomNav on mobile. md:pt-16: space for fixed DesktopNav. md:pb-8: normal bottom padding on desktop. */}
      <main className="min-h-dvh pb-24 pt-0 md:pb-8 md:pt-16">{children}</main>
      <BottomNav />
    </div>
  )
}
