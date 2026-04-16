export type WeatherCondition =
  | "clear"
  | "cloudy"
  | "partly-cloudy"
  | "rain"
  | "snow"
  | "thunder"
  | "fog"
  | "windy"
  | "humid"

export interface WeatherData {
  temp: number             // Celsius
  feels_like: number       // Celsius
  humidity: number         // 0-100
  condition: WeatherCondition
  description: string      // Human-readable (e.g. "Cielo despejado")
  city: string | null
  icon: string             // OpenWeather icon code
}

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night"

export function getTimeOfDay(hour?: number): TimeOfDay {
  const h = hour ?? new Date().getHours()
  if (h >= 6 && h < 12) return "morning"
  if (h >= 12 && h < 18) return "afternoon"
  if (h >= 18 && h < 22) return "evening"
  return "night"
}

export function getTimeOfDayLabel(tod: TimeOfDay): string {
  const labels: Record<TimeOfDay, string> = {
    morning:   "Mañana",
    afternoon: "Tarde",
    evening:   "Noche temprana",
    night:     "Noche",
  }
  return labels[tod]
}
