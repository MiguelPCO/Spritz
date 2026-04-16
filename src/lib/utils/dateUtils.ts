import { format, formatDistanceToNow, isSameDay, isToday, isYesterday } from "date-fns"
import { es } from "date-fns/locale"

export function formatDateEs(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: es })
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "d MMM", { locale: es })
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  if (isToday(d)) return "Hoy"
  if (isYesterday(d)) return "Ayer"
  return formatDistanceToNow(d, { addSuffix: true, locale: es })
}

export function getMonthLabel(year: number, month: number): string {
  return format(new Date(year, month, 1), "MMMM yyyy", { locale: es })
}

export { isSameDay, isToday, isYesterday }
