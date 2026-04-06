export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          id: string;
          actor_user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          payload?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          payload?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_call_log: {
        Row: {
          id: string;
          user_id: string | null;
          operation: string;
          provider: string;
          provider_mode: string;
          status: string;
          request_payload: Json;
          response_payload: Json;
          error_message: string | null;
          input_tokens: number;
          output_tokens: number;
          total_tokens: number;
          latency_ms: number | null;
          cache_hit: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          operation: string;
          provider: string;
          provider_mode: string;
          status: string;
          request_payload?: Json;
          response_payload?: Json;
          error_message?: string | null;
          input_tokens?: number;
          output_tokens?: number;
          total_tokens?: number;
          latency_ms?: number | null;
          cache_hit?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          operation?: string;
          provider?: string;
          provider_mode?: string;
          status?: string;
          request_payload?: Json;
          response_payload?: Json;
          error_message?: string | null;
          input_tokens?: number;
          output_tokens?: number;
          total_tokens?: number;
          latency_ms?: number | null;
          cache_hit?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_daily_budget: {
        Row: {
          id: string;
          budget_date: string;
          provider: string;
          request_count: number;
          input_tokens: number;
          output_tokens: number;
          total_tokens: number;
          soft_limit_tokens: number | null;
          hard_limit_tokens: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          budget_date: string;
          provider: string;
          request_count?: number;
          input_tokens?: number;
          output_tokens?: number;
          total_tokens?: number;
          soft_limit_tokens?: number | null;
          hard_limit_tokens?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          budget_date?: string;
          provider?: string;
          request_count?: number;
          input_tokens?: number;
          output_tokens?: number;
          total_tokens?: number;
          soft_limit_tokens?: number | null;
          hard_limit_tokens?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      content_flags: {
        Row: {
          id: string;
          reporter_user_id: string;
          target_type: string;
          target_id: string;
          reason: string;
          notes: string;
          status: string;
          resolved_by_user_id: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_user_id: string;
          target_type: string;
          target_id: string;
          reason: string;
          notes?: string;
          status?: string;
          resolved_by_user_id?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reporter_user_id?: string;
          target_type?: string;
          target_id?: string;
          reason?: string;
          notes?: string;
          status?: string;
          resolved_by_user_id?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      feature_flags: {
        Row: {
          key: string;
          description: string;
          is_enabled: boolean;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          description?: string;
          is_enabled?: boolean;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          description?: string;
          is_enabled?: boolean;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      mentor_interests: {
        Row: {
          id: string;
          user_id: string;
          path_id: string;
          note: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          path_id: string;
          note?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          path_id?: string;
          note?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      node_edges: {
        Row: {
          id: string;
          path_id: string;
          from_node_id: string;
          to_node_id: string;
          edge_kind: string;
          rationale: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          path_id: string;
          from_node_id: string;
          to_node_id: string;
          edge_kind?: string;
          rationale?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          path_id?: string;
          from_node_id?: string;
          to_node_id?: string;
          edge_kind?: string;
          rationale?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          payload: Json;
          read_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          payload?: Json;
          read_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          payload?: Json;
          read_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      parent_dashboard_cache: {
        Row: {
          id: string;
          cache_key: string;
          user_id: string;
          payload: Json;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cache_key: string;
          user_id: string;
          payload?: Json;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cache_key?: string;
          user_id?: string;
          payload?: Json;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      path_nodes: {
        Row: {
          id: string;
          path_id: string;
          node_kind: string;
          title: string;
          summary: string;
          timeline_months: number | null;
          sort_order: number;
          source_label: Database["public"]["Enums"]["source_label"];
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          path_id: string;
          node_kind: string;
          title: string;
          summary?: string;
          timeline_months?: number | null;
          sort_order?: number;
          source_label?: Database["public"]["Enums"]["source_label"];
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          path_id?: string;
          node_kind?: string;
          title?: string;
          summary?: string;
          timeline_months?: number | null;
          sort_order?: number;
          source_label?: Database["public"]["Enums"]["source_label"];
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      paths: {
        Row: {
          id: string;
          owner_user_id: string;
          title: string;
          summary: string;
          source_label: Database["public"]["Enums"]["source_label"];
          status: string;
          is_public: boolean;
          generation_context: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_user_id: string;
          title: string;
          summary?: string;
          source_label?: Database["public"]["Enums"]["source_label"];
          status?: string;
          is_public?: boolean;
          generation_context?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_user_id?: string;
          title?: string;
          summary?: string;
          source_label?: Database["public"]["Enums"]["source_label"];
          status?: string;
          is_public?: boolean;
          generation_context?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          user_id: string;
          email: string | null;
          display_name: string | null;
          date_of_birth: string | null;
          headline: string | null;
          persona: string | null;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email?: string | null;
          display_name?: string | null;
          date_of_birth?: string | null;
          headline?: string | null;
          persona?: string | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string | null;
          display_name?: string | null;
          date_of_birth?: string | null;
          headline?: string | null;
          persona?: string | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      proof_items: {
        Row: {
          id: string;
          path_id: string;
          node_id: string | null;
          title: string;
          summary: string;
          url: string | null;
          source_type: string;
          source_label: Database["public"]["Enums"]["source_label"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          path_id: string;
          node_id?: string | null;
          title: string;
          summary?: string;
          url?: string | null;
          source_type?: string;
          source_label?: Database["public"]["Enums"]["source_label"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          path_id?: string;
          node_id?: string | null;
          title?: string;
          summary?: string;
          url?: string | null;
          source_type?: string;
          source_label?: Database["public"]["Enums"]["source_label"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      resume_parses: {
        Row: {
          id: string;
          user_id: string;
          source_filename: string | null;
          source_mime_type: string | null;
          source_size_bytes: number | null;
          parse_status: string;
          raw_text: string;
          parsed_payload: Json;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_filename?: string | null;
          source_mime_type?: string | null;
          source_size_bytes?: number | null;
          parse_status?: string;
          raw_text?: string;
          parsed_payload?: Json;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_filename?: string | null;
          source_mime_type?: string | null;
          source_size_bytes?: number | null;
          parse_status?: string;
          raw_text?: string;
          parsed_payload?: Json;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          path_id: string | null;
          proof_item_id: string | null;
          value: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          path_id?: string | null;
          proof_item_id?: string | null;
          value: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          path_id?: string | null;
          proof_item_id?: string | null;
          value?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      whatif_cache: {
        Row: {
          id: string;
          cache_key: string;
          owner_user_id: string | null;
          path_id: string | null;
          scenario_hash: string;
          response_payload: Json;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cache_key: string;
          owner_user_id?: string | null;
          path_id?: string | null;
          scenario_hash: string;
          response_payload?: Json;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cache_key?: string;
          owner_user_id?: string | null;
          path_id?: string | null;
          scenario_hash?: string;
          response_payload?: Json;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      record_ai_call: {
        Args: {
          p_operation: string;
          p_provider: string;
          p_provider_mode: string;
          p_status: string;
          p_input_tokens?: number;
          p_output_tokens?: number;
          p_total_tokens?: number;
          p_latency_ms?: number | null;
          p_cache_hit?: boolean;
          p_user_id?: string | null;
          p_request_payload?: Json;
          p_response_payload?: Json;
          p_error_message?: string | null;
        };
        Returns: string;
      };
    };
    Enums: {
      source_label: "ai_suggested" | "human_backed" | "hybrid";
    };
    CompositeTypes: Record<string, never>;
  };
};
