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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agency_client_intake_links: {
        Row: {
          agency_email: string
          agency_name: string
          client_id: string | null
          created_at: string
          created_by: string
          id: string
          submitted_at: string | null
          token: string
        }
        Insert: {
          agency_email: string
          agency_name: string
          client_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          submitted_at?: string | null
          token: string
        }
        Update: {
          agency_email?: string
          agency_name?: string
          client_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          submitted_at?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_client_intake_links_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "agency_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_clients: {
        Row: {
          address: string | null
          admin_quote_assigned: boolean
          admin_quote_assigned_at: string | null
          aeo_score: number
          agency_email: string
          ai_citations: string | null
          brand_name: string | null
          business_name: string
          category: string | null
          contact_name: string
          created_at: string
          ctr: string | null
          description: string | null
          email: string | null
          gbp_score: number
          geo_score: number
          id: string
          intake_data: Json
          mobile: string
          monthly_clicks: string | null
          monthly_impressions: string | null
          payment_strategy: string | null
          progress: number
          retainer_fee: string | null
          seo_score: number
          services: Json
          status: string
          tenure_months: number | null
          tenure_start_date: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          admin_quote_assigned?: boolean
          admin_quote_assigned_at?: string | null
          aeo_score?: number
          agency_email: string
          ai_citations?: string | null
          brand_name?: string | null
          business_name: string
          category?: string | null
          contact_name: string
          created_at?: string
          ctr?: string | null
          description?: string | null
          email?: string | null
          gbp_score?: number
          geo_score?: number
          id: string
          intake_data?: Json
          mobile: string
          monthly_clicks?: string | null
          monthly_impressions?: string | null
          payment_strategy?: string | null
          progress?: number
          retainer_fee?: string | null
          seo_score?: number
          services?: Json
          status?: string
          tenure_months?: number | null
          tenure_start_date?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          admin_quote_assigned?: boolean
          admin_quote_assigned_at?: string | null
          aeo_score?: number
          agency_email?: string
          ai_citations?: string | null
          brand_name?: string | null
          business_name?: string
          category?: string | null
          contact_name?: string
          created_at?: string
          ctr?: string | null
          description?: string | null
          email?: string | null
          gbp_score?: number
          geo_score?: number
          id?: string
          intake_data?: Json
          mobile?: string
          monthly_clicks?: string | null
          monthly_impressions?: string | null
          payment_strategy?: string | null
          progress?: number
          retainer_fee?: string | null
          seo_score?: number
          services?: Json
          status?: string
          tenure_months?: number | null
          tenure_start_date?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      agency_invoices: {
        Row: {
          agency_email: string
          amount: string
          client_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          month: string
          raw_amount: number | null
          status: string
          updated_at: string
        }
        Insert: {
          agency_email: string
          amount: string
          client_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id: string
          month: string
          raw_amount?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          agency_email?: string
          amount?: string
          client_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          month?: string
          raw_amount?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "agency_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_profiles: {
        Row: {
          agency_logo: string | null
          agency_name: string | null
          contact_person: string | null
          created_at: string
          custom_socials: Json
          facebook: string | null
          instagram: string | null
          linkedin: string | null
          phone: string | null
          updated_at: string
          user_email: string
          website: string | null
          youtube: string | null
        }
        Insert: {
          agency_logo?: string | null
          agency_name?: string | null
          contact_person?: string | null
          created_at?: string
          custom_socials?: Json
          facebook?: string | null
          instagram?: string | null
          linkedin?: string | null
          phone?: string | null
          updated_at?: string
          user_email: string
          website?: string | null
          youtube?: string | null
        }
        Update: {
          agency_logo?: string | null
          agency_name?: string | null
          contact_person?: string | null
          created_at?: string
          custom_socials?: Json
          facebook?: string | null
          instagram?: string | null
          linkedin?: string | null
          phone?: string | null
          updated_at?: string
          user_email?: string
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean
          message: string
          sender_email: string
          submission_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin?: boolean
          message: string
          sender_email: string
          submission_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean
          message?: string
          sender_email?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          agency_email: string | null
          company_name: string
          contact_email: string
          contact_name: string
          created_at: string
          id: string
          industry: string | null
          notes: string | null
          owner_email: string | null
          phone: string | null
          status: string
          tier: string
          updated_at: string
          website: string | null
        }
        Insert: {
          agency_email?: string | null
          company_name: string
          contact_email: string
          contact_name: string
          created_at?: string
          id?: string
          industry?: string | null
          notes?: string | null
          owner_email?: string | null
          phone?: string | null
          status?: string
          tier?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          agency_email?: string | null
          company_name?: string
          contact_email?: string
          contact_name?: string
          created_at?: string
          id?: string
          industry?: string | null
          notes?: string | null
          owner_email?: string | null
          phone?: string | null
          status?: string
          tier?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          assigned_to: string | null
          bounty_reward: string | null
          created_at: string | null
          designation: string | null
          email: string
          id: string
          inquiry_type: string
          is_public: boolean
          message: string
          name: string
          organization: string | null
          progress: number
          status: string
        }
        Insert: {
          assigned_to?: string | null
          bounty_reward?: string | null
          created_at?: string | null
          designation?: string | null
          email: string
          id?: string
          inquiry_type: string
          is_public?: boolean
          message: string
          name: string
          organization?: string | null
          progress?: number
          status?: string
        }
        Update: {
          assigned_to?: string | null
          bounty_reward?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string
          id?: string
          inquiry_type?: string
          is_public?: boolean
          message?: string
          name?: string
          organization?: string | null
          progress?: number
          status?: string
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          file_name: string | null
          file_type: string
          id: string
          uploaded_by: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          file_name?: string | null
          file_type: string
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          file_name?: string | null
          file_type?: string
          id?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      portal_users: {
        Row: {
          auth_user_id: string | null
          confirmed: boolean
          created_at: string
          designation: string | null
          email: string
          id: string
          name: string | null
          notes: string | null
          organization: string | null
          phone: string | null
          quote: string | null
          role: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          confirmed?: boolean
          created_at?: string
          designation?: string | null
          email: string
          id?: string
          name?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          quote?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          confirmed?: boolean
          created_at?: string
          designation?: string | null
          email?: string
          id?: string
          name?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          quote?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_likes: {
        Row: {
          likes_count: number
          project_id: string
          updated_at: string
        }
        Insert: {
          likes_count?: number
          project_id: string
          updated_at?: string
        }
        Update: {
          likes_count?: number
          project_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          idea_rating: number | null
          name: string
          project_id: string
          project_name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          idea_rating?: number | null
          name: string
          project_id: string
          project_name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          idea_rating?: number | null
          name?: string
          project_id?: string
          project_name?: string
        }
        Relationships: []
      }
      requirement_events: {
        Row: {
          actor_email: string
          created_at: string
          event_type: string
          from_value: string | null
          id: string
          note: string | null
          requirement_id: string
          to_value: string | null
        }
        Insert: {
          actor_email: string
          created_at?: string
          event_type: string
          from_value?: string | null
          id?: string
          note?: string | null
          requirement_id: string
          to_value?: string | null
        }
        Update: {
          actor_email?: string
          created_at?: string
          event_type?: string
          from_value?: string | null
          id?: string
          note?: string | null
          requirement_id?: string
          to_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requirement_events_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      requirement_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          requirement_id: string
          sender_email: string
          sender_role: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          requirement_id: string
          sender_email: string
          sender_role?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          requirement_id?: string
          sender_email?: string
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "requirement_messages_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      requirements: {
        Row: {
          agency_email: string | null
          assigned_to_email: string | null
          attachments: Json
          budget_range: string | null
          client_id: string | null
          created_at: string
          description: string
          estimated_value: number | null
          id: string
          priority: string
          progress: number
          req_type: string
          status: string
          submitted_by_email: string
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          agency_email?: string | null
          assigned_to_email?: string | null
          attachments?: Json
          budget_range?: string | null
          client_id?: string | null
          created_at?: string
          description: string
          estimated_value?: number | null
          id?: string
          priority?: string
          progress?: number
          req_type?: string
          status?: string
          submitted_by_email: string
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          agency_email?: string | null
          assigned_to_email?: string | null
          attachments?: Json
          budget_range?: string | null
          client_id?: string | null
          created_at?: string
          description?: string
          estimated_value?: number | null
          id?: string
          priority?: string
          progress?: number
          req_type?: string
          status?: string
          submitted_by_email?: string
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requirements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_portal_admin: { Args: never; Returns: boolean }
      jwt_email: { Args: never; Returns: string }
      jwt_role: { Args: never; Returns: string }
      match_knowledge_base: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          content: string
          file_name: string
          file_type: string
          id: string
          similarity: number
        }[]
      }
      requirement_pipeline_summary: {
        Args: never
        Returns: {
          avg_progress: number
          requirement_count: number
          status: string
          total_value: number
        }[]
      }
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
