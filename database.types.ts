export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      app_user: {
        Row: {
          app_user_id: number
          line_account_id: string
          supabase_uuid: string
        }
        Insert: {
          app_user_id?: number
          line_account_id: string
          supabase_uuid: string
        }
        Update: {
          app_user_id?: number
          line_account_id?: string
          supabase_uuid?: string
        }
        Relationships: []
      }
      event: {
        Row: {
          created_at: string
          created_by: number
          event_date: string
          event_description: string
          event_id: number
          event_name: string
          location: string
          updated_at: string
        }
        Insert: {
          created_at: string
          created_by: number
          event_date: string
          event_description: string
          event_id?: number
          event_name: string
          location: string
          updated_at: string
        }
        Update: {
          created_at?: string
          created_by?: number
          event_date?: string
          event_description?: string
          event_id?: number
          event_name?: string
          location?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["app_user_id"]
          },
        ]
      }
      event_group_participation: {
        Row: {
          event_group_participation_id: number
          event_id: number
          idol_group_id: number
          registered_at: string
        }
        Insert: {
          event_group_participation_id?: number
          event_id: number
          idol_group_id: number
          registered_at: string
        }
        Update: {
          event_group_participation_id?: number
          event_id?: number
          idol_group_id?: number
          registered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_group_event"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "fk_event_group_idol_group"
            columns: ["idol_group_id"]
            isOneToOne: false
            referencedRelation: "idol_group"
            referencedColumns: ["idol_group_id"]
          },
        ]
      }
      event_participation: {
        Row: {
          app_user_id: number
          event_id: number
          event_participation_id: number
          joined_at: string
        }
        Insert: {
          app_user_id: number
          event_id: number
          event_participation_id?: number
          joined_at: string
        }
        Update: {
          app_user_id?: number
          event_id?: number
          event_participation_id?: number
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_participation_app_user"
            columns: ["app_user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["app_user_id"]
          },
          {
            foreignKeyName: "fk_event_participation_event"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["event_id"]
          },
        ]
      }
      group_category: {
        Row: {
          category_name: string
          group_category_id: number
        }
        Insert: {
          category_name: string
          group_category_id?: number
        }
        Update: {
          category_name?: string
          group_category_id?: number
        }
        Relationships: []
      }
      group_otaku_layer: {
        Row: {
          group_otaku_layer_id: number
          layer_name: string
          max_score: number
          min_score: number
        }
        Insert: {
          group_otaku_layer_id?: number
          layer_name: string
          max_score: number
          min_score: number
        }
        Update: {
          group_otaku_layer_id?: number
          layer_name?: string
          max_score?: number
          min_score?: number
        }
        Relationships: []
      }
      idol_group: {
        Row: {
          group_category_id: number
          idol_group_id: number
          idol_group_name: string
          thumbnail_image: string | null
        }
        Insert: {
          group_category_id: number
          idol_group_id?: number
          idol_group_name: string
          thumbnail_image?: string | null
        }
        Update: {
          group_category_id?: number
          idol_group_id?: number
          idol_group_name?: string
          thumbnail_image?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_group_category"
            columns: ["group_category_id"]
            isOneToOne: false
            referencedRelation: "group_category"
            referencedColumns: ["group_category_id"]
          },
        ]
      }
      monthly_score_history: {
        Row: {
          app_user_id: number
          month: string
          monthly_score_history_id: number
          score_snapshot: number
          updated_at: string
        }
        Insert: {
          app_user_id: number
          month: string
          monthly_score_history_id?: number
          score_snapshot: number
          updated_at: string
        }
        Update: {
          app_user_id?: number
          month?: string
          monthly_score_history_id?: number
          score_snapshot?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_monthly_score_app_user"
            columns: ["app_user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["app_user_id"]
          },
        ]
      }
      quiz_difficulty: {
        Row: {
          difficulty_name: string
          quiz_difficulty_id: number
        }
        Insert: {
          difficulty_name: string
          quiz_difficulty_id?: number
        }
        Update: {
          difficulty_name?: string
          quiz_difficulty_id?: number
        }
        Relationships: []
      }
      quiz_question: {
        Row: {
          choice1: string
          choice2: string
          choice3: string
          choice4: string
          correct_choice: number
          explanation: string
          idol_group_id: number
          question_text: string
          quiz_difficulty_id: number
          quiz_question_id: number
        }
        Insert: {
          choice1: string
          choice2: string
          choice3: string
          choice4: string
          correct_choice: number
          explanation: string
          idol_group_id: number
          question_text: string
          quiz_difficulty_id: number
          quiz_question_id?: number
        }
        Update: {
          choice1?: string
          choice2?: string
          choice3?: string
          choice4?: string
          correct_choice?: number
          explanation?: string
          idol_group_id?: number
          question_text?: string
          quiz_difficulty_id?: number
          quiz_question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_quiz_question_idol_group"
            columns: ["idol_group_id"]
            isOneToOne: false
            referencedRelation: "idol_group"
            referencedColumns: ["idol_group_id"]
          },
          {
            foreignKeyName: "fk_quiz_question_quiz_difficulty"
            columns: ["quiz_difficulty_id"]
            isOneToOne: false
            referencedRelation: "quiz_difficulty"
            referencedColumns: ["quiz_difficulty_id"]
          },
        ]
      }
      ranking_group: {
        Row: {
          app_user_id: number
          display_rank: number
          display_score: number
          idol_group_id: number
          ranking_group_id: number
          updated_at: string
        }
        Insert: {
          app_user_id: number
          display_rank: number
          display_score: number
          idol_group_id: number
          ranking_group_id?: number
          updated_at: string
        }
        Update: {
          app_user_id?: number
          display_rank?: number
          display_score?: number
          idol_group_id?: number
          ranking_group_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ranking_group_app_user"
            columns: ["app_user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["app_user_id"]
          },
          {
            foreignKeyName: "fk_ranking_group_idol_group"
            columns: ["idol_group_id"]
            isOneToOne: false
            referencedRelation: "idol_group"
            referencedColumns: ["idol_group_id"]
          },
        ]
      }
      ranking_total: {
        Row: {
          app_user_id: number
          display_rank: number
          display_score: number
          ranking_total_id: number
          updated_at: string
        }
        Insert: {
          app_user_id: number
          display_rank: number
          display_score: number
          ranking_total_id?: number
          updated_at: string
        }
        Update: {
          app_user_id?: number
          display_rank?: number
          display_score?: number
          ranking_total_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ranking_total_app_user"
            columns: ["app_user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["app_user_id"]
          },
        ]
      }
      total_otaku_layer: {
        Row: {
          layer_name: string
          max_score: number
          min_score: number
          total_otaku_layer_id: number
        }
        Insert: {
          layer_name: string
          max_score: number
          min_score: number
          total_otaku_layer_id?: number
        }
        Update: {
          layer_name?: string
          max_score?: number
          min_score?: number
          total_otaku_layer_id?: number
        }
        Relationships: []
      }
      user_idol_group_score: {
        Row: {
          app_user_id: number
          group_otaku_layer_id: number
          idol_group_id: number
          otaku_score: number
          user_idol_group_score_id: number
        }
        Insert: {
          app_user_id: number
          group_otaku_layer_id: number
          idol_group_id: number
          otaku_score: number
          user_idol_group_score_id?: number
        }
        Update: {
          app_user_id?: number
          group_otaku_layer_id?: number
          idol_group_id?: number
          otaku_score?: number
          user_idol_group_score_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_idol_app_user"
            columns: ["app_user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["app_user_id"]
          },
          {
            foreignKeyName: "fk_user_idol_group_otaku_layer"
            columns: ["group_otaku_layer_id"]
            isOneToOne: false
            referencedRelation: "group_otaku_layer"
            referencedColumns: ["group_otaku_layer_id"]
          },
          {
            foreignKeyName: "fk_user_idol_idol_group"
            columns: ["idol_group_id"]
            isOneToOne: false
            referencedRelation: "idol_group"
            referencedColumns: ["idol_group_id"]
          },
        ]
      }
      user_profile: {
        Row: {
          app_user_id: number
          remaining_drop: number
          total_otaku_layer_id: number
          total_otaku_score: number
          user_name: string
          user_profile_id: number
        }
        Insert: {
          app_user_id: number
          remaining_drop: number
          total_otaku_layer_id: number
          total_otaku_score: number
          user_name: string
          user_profile_id?: number
        }
        Update: {
          app_user_id?: number
          remaining_drop?: number
          total_otaku_layer_id?: number
          total_otaku_score?: number
          user_name?: string
          user_profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_app_user"
            columns: ["app_user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["app_user_id"]
          },
          {
            foreignKeyName: "fk_total_otaku_layer"
            columns: ["total_otaku_layer_id"]
            isOneToOne: false
            referencedRelation: "total_otaku_layer"
            referencedColumns: ["total_otaku_layer_id"]
          },
        ]
      }
      user_quiz_answer: {
        Row: {
          answered_at: string
          app_user_id: number
          is_correct: boolean
          quiz_question_id: number
          selected_choice: number
          user_quiz_answer_id: number
        }
        Insert: {
          answered_at: string
          app_user_id: number
          is_correct: boolean
          quiz_question_id: number
          selected_choice: number
          user_quiz_answer_id?: number
        }
        Update: {
          answered_at?: string
          app_user_id?: number
          is_correct?: boolean
          quiz_question_id?: number
          selected_choice?: number
          user_quiz_answer_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_quiz_app_user"
            columns: ["app_user_id"]
            isOneToOne: false
            referencedRelation: "app_user"
            referencedColumns: ["app_user_id"]
          },
          {
            foreignKeyName: "fk_user_quiz_question"
            columns: ["quiz_question_id"]
            isOneToOne: false
            referencedRelation: "quiz_question"
            referencedColumns: ["quiz_question_id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

