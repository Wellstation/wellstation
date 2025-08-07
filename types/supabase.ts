export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      feedback: {
        Row: {
          contact: string
          content: string
          created_at: string | null
          id: string
          name: string
          rating: number | null
          service_type: string
          updated_at: string | null
          visit_date: string | null
        }
        Insert: {
          contact: string
          content: string
          created_at?: string | null
          id?: string
          name: string
          rating?: number | null
          service_type: string
          updated_at?: string | null
          visit_date?: string | null
        }
        Update: {
          contact?: string
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          rating?: number | null
          service_type?: string
          updated_at?: string | null
          visit_date?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_alt: string | null
          image_url: string
          is_active: boolean | null
          service_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_alt?: string | null
          image_url: string
          is_active?: boolean | null
          service_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_alt?: string | null
          image_url?: string
          is_active?: boolean | null
          service_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      phone_verifications: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          phone: string
          updated_at: string | null
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          phone: string
          updated_at?: string | null
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          phone?: string
          updated_at?: string | null
          used?: boolean | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          cancelled_date: string | null
          created_at: string | null
          etc: string | null
          id: string
          model: string | null
          name: string
          next_inspection_date: string | null
          notes: string | null
          phone: string
          request: string | null
          reservation_date: string
          service_type: string
          status: string
          updated_at: string | null
          vehicle_info: string | null
          vin: string | null
          visited_date: string | null
          work_details: string | null
        }
        Insert: {
          cancelled_date?: string | null
          created_at?: string | null
          etc?: string | null
          id?: string
          model?: string | null
          name: string
          next_inspection_date?: string | null
          notes?: string | null
          phone: string
          request?: string | null
          reservation_date: string
          service_type: string
          status?: string
          updated_at?: string | null
          vehicle_info?: string | null
          vin?: string | null
          visited_date?: string | null
          work_details?: string | null
        }
        Update: {
          cancelled_date?: string | null
          created_at?: string | null
          etc?: string | null
          id?: string
          model?: string | null
          name?: string
          next_inspection_date?: string | null
          notes?: string | null
          phone?: string
          request?: string | null
          reservation_date?: string
          service_type?: string
          status?: string
          updated_at?: string | null
          vehicle_info?: string | null
          vin?: string | null
          visited_date?: string | null
          work_details?: string | null
        }
        Relationships: []
      }
      service_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          service_type: string
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          service_type: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          service_type?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      visitor_counts: {
        Row: {
          count: number
          created_at: string | null
          date: string
          id: number
          updated_at: string | null
        }
        Insert: {
          count?: number
          created_at?: string | null
          date: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          count?: number
          created_at?: string | null
          date?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      visitor_sessions: {
        Row: {
          created_at: string | null
          date: string
          id: number
          session_key: string
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: number
          session_key: string
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: number
          session_key?: string
          visitor_id?: string
        }
        Relationships: []
      }
      work_images: {
        Row: {
          created_at: string | null
          id: string
          image_description: string | null
          image_url: string
          work_record_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_description?: string | null
          image_url: string
          work_record_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_description?: string | null
          image_url?: string
          work_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_images_work_record_id_fkey"
            columns: ["work_record_id"]
            isOneToOne: false
            referencedRelation: "work_records"
            referencedColumns: ["id"]
          },
        ]
      }
      work_record_likes: {
        Row: {
          created_at: string | null
          id: string
          user_ip: string
          work_record_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_ip: string
          work_record_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_ip?: string
          work_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_record_likes_work_record_id_fkey"
            columns: ["work_record_id"]
            isOneToOne: false
            referencedRelation: "work_records"
            referencedColumns: ["id"]
          },
        ]
      }
      work_record_views: {
        Row: {
          id: string
          user_ip: string
          viewed_at: string | null
          work_record_id: string | null
        }
        Insert: {
          id?: string
          user_ip: string
          viewed_at?: string | null
          work_record_id?: string | null
        }
        Update: {
          id?: string
          user_ip?: string
          viewed_at?: string | null
          work_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_record_views_work_record_id_fkey"
            columns: ["work_record_id"]
            isOneToOne: false
            referencedRelation: "work_records"
            referencedColumns: ["id"]
          },
        ]
      }
      work_records: {
        Row: {
          created_at: string | null
          id: string
          likes_count: number | null
          service_type: string
          updated_at: string | null
          views_count: number | null
          work_date: string
          work_description: string | null
          work_title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          likes_count?: number | null
          service_type: string
          updated_at?: string | null
          views_count?: number | null
          work_date: string
          work_description?: string | null
          work_title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          likes_count?: number | null
          service_type?: string
          updated_at?: string | null
          views_count?: number | null
          work_date?: string
          work_description?: string | null
          work_title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
