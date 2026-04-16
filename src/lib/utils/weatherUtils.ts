import type { WeatherCondition } from "@/types/weather"

/** Map OpenWeather condition id ranges to our WeatherCondition enum */
export function mapOWCondition(conditionId: number): WeatherCondition {
  if (conditionId >= 200 && conditionId < 300) return "thunder"
  if (conditionId >= 300 && conditionId < 600) return "rain"
  if (conditionId >= 600 && conditionId < 700) return "snow"
  if (conditionId >= 700 && conditionId < 800) return "fog"
  if (conditionId === 800) return "clear"
  if (conditionId === 801 || conditionId === 802) return "partly-cloudy"
  if (conditionId >= 803) return "cloudy"
  return "clear"
}

/** Fragrance family recommendations based on weather */
export function getWeatherScentHint(condition: WeatherCondition, temp: number): string {
  if (temp > 28) return "Hoy va muy bien algo fresco y ligero"
  if (temp < 10) return "El frío invita a fragancias cálidas y envolventes"
  if (condition === "rain") return "La lluvia intensifica los amaderados"
  if (condition === "clear" && temp > 20) return "Día perfecto para fragancias cítricas o acuáticas"
  return "Un día ideal para cualquier fragancia de tu colección"
}
