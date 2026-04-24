export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          credits: number
          display_name: string | null
          email: string
          id: string
          unlimited_credits: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number
          display_name?: string | null
          email: string
          id?: string
          unlimited_credits?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number
          display_name?: string | null
          email?: string
          id?: string
          unlimited_credits?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shipment_events: {
        Row: {
          created_at: string
          created_by: string | null
          event_at: string
          id: string
          location: string | null
          note: string | null
          shipment_id: string
          status: Database["public"]["Enums"]["shipment_status"] | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          event_at?: string
          id?: string
          location?: string | null
          note?: string | null
          shipment_id: string
          status?: Database["public"]["Enums"]["shipment_status"] | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event_at?: string
          id?: string
          location?: string | null
          note?: string | null
          shipment_id?: string
          status?: Database["public"]["Enums"]["shipment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          amount_to_pay: number | null
          courier: string | null
          created_at: string
          created_by: string | null
          description: string | null
          destination: string
          estimated_delivery_date: string | null
          id: string
          images: string[]
          is_express: boolean
          is_fragile: boolean
          origin: string
          payment_method: string | null
          payment_reason: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          progress: number
          quantity: number
          receiver_email: string | null
          receiver_name: string
          receiver_phone: string | null
          sender_email: string | null
          sender_name: string
          sender_phone: string | null
          shipment_type: string
          shipped_at: string
          status: Database["public"]["Enums"]["shipment_status"]
          tracking_number: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          amount_to_pay?: number | null
          courier?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          destination: string
          estimated_delivery_date?: string | null
          id?: string
          images?: string[]
          is_express?: boolean
          is_fragile?: boolean
          origin: string
          payment_method?: string | null
          payment_reason?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          progress?: number
          quantity?: number
          receiver_email?: string | null
          receiver_name: string
          receiver_phone?: string | null
          sender_email?: string | null
          sender_name: string
          sender_phone?: string | null
          shipment_type: string
          shipped_at?: string
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_number: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          amount_to_pay?: number | null
          courier?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          destination?: string
          estimated_delivery_date?: string | null
          id?: string
          images?: string[]
          is_express?: boolean
          is_fragile?: boolean
          origin?: string
          payment_method?: string | null
          payment_reason?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          progress?: number
          quantity?: number
          receiver_email?: string | null
          receiver_name?: string
          receiver_phone?: string | null
          sender_email?: string | null
          sender_name?: string
          sender_phone?: string | null
          shipment_type?: string
          shipped_at?: string
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_number?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "staff"
      payment_status: "pending" | "paid"
      shipment_status:
        | "queued"
        | "in_transit"
        | "out_for_delivery"
        | "arrived"
        | "delivered"
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
    Enums: {
      app_role: ["super_admin", "admin", "staff"],
      payment_status: ["pending", "paid"],
      shipment_status: [
        "queued",
        "in_transit",
        "out_for_delivery",
        "arrived",
        "delivered",
      ],
    },
  },
} as const
