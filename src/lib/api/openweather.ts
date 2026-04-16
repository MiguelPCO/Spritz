import type { WeatherData } from "@/types/weather"
import { mapOWCondition } from "@/lib/utils/weatherUtils"

interface OWResponse {
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: Array<{
    id: number
    description: string
    icon: string
  }>
  name: string
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) throw new Error("OPENWEATHER_API_KEY is not set")

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`

  const res = await fetch(url, {
    next: { revalidate: 1800 }, // cache 30 minutes
  })

  if (!res.ok) {
    throw new Error(`OpenWeather API error: ${res.status} ${res.statusText}`)
  }

  const data: OWResponse = await res.json()
  const weatherItem = data.weather[0]

  return {
    temp: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    condition: mapOWCondition(weatherItem.id),
    description: capitalize(weatherItem.description),
    city: data.name || null,
    icon: weatherItem.icon,
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
