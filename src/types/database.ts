export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          category: string
          image_url: string
          date: string
          time: string
          location: string
          city: string
          price_min: number
          price_max: number
          organizer: string
          attendees: number
          latitude: number
          longitude: number
          is_premium: boolean
          source: string | null
          creator_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          category: string
          image_url: string
          date: string
          time: string
          location: string
          city: string
          price_min?: number
          price_max?: number
          organizer: string
          attendees?: number
          latitude: number
          longitude: number
          is_premium?: boolean
          source?: string | null
          creator_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          category?: string
          image_url?: string
          date?: string
          time?: string
          location?: string
          city?: string
          price_min?: number
          price_max?: number
          organizer?: string
          attendees?: number
          latitude?: number
          longitude?: number
          is_premium?: boolean
          source?: string | null
          creator_id?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string | null
          profile_photo: string | null
          cover_photo: string | null
          is_premium: boolean
          is_admin: boolean
          email_visible: boolean
          deleted_at: string | null
          deletion_reason: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          name?: string | null
          profile_photo?: string | null
          cover_photo?: string | null
          is_premium?: boolean
          is_admin?: boolean
          email_visible?: boolean
          deleted_at?: string | null
          deletion_reason?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string | null
          profile_photo?: string | null
          cover_photo?: string | null
          is_premium?: boolean
          is_admin?: boolean
          email_visible?: boolean
          deleted_at?: string | null
          deletion_reason?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          created_at: string
          user_id: string
          event_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          event_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          event_id?: string
        }
      }
      attendances: {
        Row: {
          id: string
          created_at: string
          user_id: string
          event_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          event_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          event_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      nearby_events: {
        Args: {
          lat: number
          long: number
          distance_km: number
        }
        Returns: {
          id: string
          title: string
          distance: number
        }[]
      }
      soft_delete_user_account: {
        Args: {
          p_user_id: string
          p_reason: string | null
        }
        Returns: void
      }
      restore_account: {
        Args: {
          p_user_id: string
        }
        Returns: void
      }
      cleanup_old_deleted_accounts: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
