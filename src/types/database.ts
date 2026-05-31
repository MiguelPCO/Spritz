/**
 * Supabase Database Types
 * Run `pnpm supabase gen types typescript --project-id YOUR_ID` to regenerate
 * after schema changes.
 *
 * For now, this is a manual type definition matching our schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          location: Json | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          location?: Json | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          location?: Json | null
          preferences?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      fragrances: {
        Row: {
          id: string
          name: string
          brand: string
          family: string
          top_notes: string[] | null
          middle_notes: string[] | null
          base_notes: string[] | null
          description: string | null
          image_url: string | null
          external_id: string | null
          gender: string | null
          concentration: string | null
          year_released: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          family: string
          top_notes?: string[] | null
          middle_notes?: string[] | null
          base_notes?: string[] | null
          description?: string | null
          image_url?: string | null
          external_id?: string | null
          gender?: string | null
          concentration?: string | null
          year_released?: number | null
          created_at?: string
        }
        Update: {
          name?: string
          brand?: string
          family?: string
          top_notes?: string[] | null
          middle_notes?: string[] | null
          base_notes?: string[] | null
          description?: string | null
          image_url?: string | null
          external_id?: string | null
          gender?: string | null
          concentration?: string | null
          year_released?: number | null
        }
        Relationships: []
      }
      user_fragrances: {
        Row: {
          id: string
          user_id: string
          fragrance_id: string | null
          custom_name: string | null
          custom_brand: string | null
          custom_families: string[]
          custom_notes: Json | null
          photo_url: string | null
          personal_notes: string | null
          status: string
          ml_remaining: number | null
          purchase_date: string | null
          purchase_price: number | null
          wishlist_position: number | null
          price_target: number | null
          occasion_tags: string[]
          season_tags: string[]
          mood_tags: string[]
          date_added: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fragrance_id?: string | null
          custom_name?: string | null
          custom_brand?: string | null
          custom_families?: string[]
          custom_notes?: Json | null
          photo_url?: string | null
          personal_notes?: string | null
          status?: string
          ml_remaining?: number | null
          purchase_date?: string | null
          purchase_price?: number | null
          wishlist_position?: number | null
          price_target?: number | null
          occasion_tags?: string[]
          season_tags?: string[]
          mood_tags?: string[]
          date_added?: string
          updated_at?: string
        }
        Update: {
          fragrance_id?: string | null
          custom_name?: string | null
          custom_brand?: string | null
          custom_families?: string[]
          custom_notes?: Json | null
          photo_url?: string | null
          personal_notes?: string | null
          status?: string
          ml_remaining?: number | null
          purchase_date?: string | null
          purchase_price?: number | null
          wishlist_position?: number | null
          price_target?: number | null
          occasion_tags?: string[]
          season_tags?: string[]
          mood_tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      wear_logs: {
        Row: {
          id: string
          user_id: string
          user_fragrance_id: string
          worn_at: string
          occasion: string | null
          mood: string | null
          weather_data: Json | null
          ai_recommended: boolean
          rating: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_fragrance_id: string
          worn_at?: string
          occasion?: string | null
          mood?: string | null
          weather_data?: Json | null
          ai_recommended?: boolean
          rating?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          occasion?: string | null
          mood?: string | null
          weather_data?: Json | null
          ai_recommended?: boolean
          rating?: number | null
          notes?: string | null
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      scent_family: "woody" | "fresh" | "floral" | "oriental" | "green" | "amber"
      fragrance_status: "active" | "empty" | "wishlist" | "sold"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
