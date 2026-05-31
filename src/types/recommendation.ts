import type { WeatherData, TimeOfDay } from "./weather"
import type { UserFragrance } from "./fragrance"

/** Input context sent to the AI recommendation engine */
export interface AIPromptContext {
  weather: WeatherData
  timeOfDay: TimeOfDay
  occasions: string[]
  moods: string[]
  freeText?: string
  recentWears: Array<{
    fragranceName: string
    brand: string
    wornAt: string // ISO date string
  }>
  wardrobe: Array<{
    id: string
    name: string
    brand: string
    family: string
    families: string[]
    occasionTags: string[]
    moodTags: string[]
    topNotes: string[]
  }>
}

/** The raw AI response shape (validated before use) */
export interface AIRecommendationResponse {
  fragranceId: string
  reason: string
}

/** Full recommendation result with resolved fragrance data */
export interface RecommendationResult {
  userFragrance: UserFragrance
  reason: string
  weather: WeatherData
  timeOfDay: TimeOfDay
  generatedAt: string // ISO date string
}

/** Wear log record */
export interface WearLog {
  id: string
  user_id: string
  user_fragrance_id: string
  user_fragrance: UserFragrance | null
  worn_at: string
  occasion: string | null
  mood: string | null
  weather_data: {
    temp: number
    feels_like: number
    condition: string
    humidity: number
    description: string
  } | null
  ai_recommended: boolean
  rating: number | null
  notes: string | null
  created_at: string
}
