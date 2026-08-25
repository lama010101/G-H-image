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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      ai_guess: {
        Row: {
          ai_analysis: string | null
          ai_generated_probability: number | null
          celebrity: boolean | null
          celebrity_name: string | null
          confidence_event: number | null
          confidence_exact_date: number | null
          confidence_location: number | null
          confidence_year: number | null
          created_at: string | null
          description: string | null
          event: string | null
          exact_date: string | null
          extracted_text: string | null
          gps_lat: number | null
          gps_lon: number | null
          id: number
          image_name: string | null
          image_url: string | null
          location_name: string | null
          model: string | null
          prompt: string | null
          raw_result: Json | null
          real_event: boolean | null
          title: string | null
          visual_elements: string | null
          wikipedia_direct_url: string | null
          wikipedia_search_url: string | null
          year: number | null
        }
        Insert: {
          ai_analysis?: string | null
          ai_generated_probability?: number | null
          celebrity?: boolean | null
          celebrity_name?: string | null
          confidence_event?: number | null
          confidence_exact_date?: number | null
          confidence_location?: number | null
          confidence_year?: number | null
          created_at?: string | null
          description?: string | null
          event?: string | null
          exact_date?: string | null
          extracted_text?: string | null
          gps_lat?: number | null
          gps_lon?: number | null
          id?: number
          image_name?: string | null
          image_url?: string | null
          location_name?: string | null
          model?: string | null
          prompt?: string | null
          raw_result?: Json | null
          real_event?: boolean | null
          title?: string | null
          visual_elements?: string | null
          wikipedia_direct_url?: string | null
          wikipedia_search_url?: string | null
          year?: number | null
        }
        Update: {
          ai_analysis?: string | null
          ai_generated_probability?: number | null
          celebrity?: boolean | null
          celebrity_name?: string | null
          confidence_event?: number | null
          confidence_exact_date?: number | null
          confidence_location?: number | null
          confidence_year?: number | null
          created_at?: string | null
          description?: string | null
          event?: string | null
          exact_date?: string | null
          extracted_text?: string | null
          gps_lat?: number | null
          gps_lon?: number | null
          id?: number
          image_name?: string | null
          image_url?: string | null
          location_name?: string | null
          model?: string | null
          prompt?: string | null
          raw_result?: Json | null
          real_event?: boolean | null
          title?: string | null
          visual_elements?: string | null
          wikipedia_direct_url?: string | null
          wikipedia_search_url?: string | null
          year?: number | null
        }
        Relationships: []
      }
      ai_guess_aggregate: {
        Row: {
          consensus_caption: string | null
          consensus_event: string | null
          consensus_location_name: string | null
          consensus_year_range: string | null
          contributing_models: Json | null
          created_at: string | null
          image_id: string
          mean_ai_gen_prob: number | null
          mean_conf_event: number | null
          mean_conf_loc: number | null
          mean_conf_year: number | null
          mean_year: number | null
          models_complete: boolean | null
          raw_compound_json: Json | null
          std_ai_gen_prob: number | null
          std_conf_event: number | null
          std_conf_loc: number | null
          std_conf_year: number | null
          std_year: number | null
        }
        Insert: {
          consensus_caption?: string | null
          consensus_event?: string | null
          consensus_location_name?: string | null
          consensus_year_range?: string | null
          contributing_models?: Json | null
          created_at?: string | null
          image_id: string
          mean_ai_gen_prob?: number | null
          mean_conf_event?: number | null
          mean_conf_loc?: number | null
          mean_conf_year?: number | null
          mean_year?: number | null
          models_complete?: boolean | null
          raw_compound_json?: Json | null
          std_ai_gen_prob?: number | null
          std_conf_event?: number | null
          std_conf_loc?: number | null
          std_conf_year?: number | null
          std_year?: number | null
        }
        Update: {
          consensus_caption?: string | null
          consensus_event?: string | null
          consensus_location_name?: string | null
          consensus_year_range?: string | null
          contributing_models?: Json | null
          created_at?: string | null
          image_id?: string
          mean_ai_gen_prob?: number | null
          mean_conf_event?: number | null
          mean_conf_loc?: number | null
          mean_conf_year?: number | null
          mean_year?: number | null
          models_complete?: boolean | null
          raw_compound_json?: Json | null
          std_ai_gen_prob?: number | null
          std_conf_event?: number | null
          std_conf_loc?: number | null
          std_conf_year?: number | null
          std_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_guess_aggregate_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: true
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      air_entries: {
        Row: {
          created_at: string
          id: string
          identifier: string
          model_id: number
          source: string
          user_id: string | null
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          identifier?: string
          model_id: number
          source: string
          user_id?: string | null
          version: number
        }
        Update: {
          created_at?: string
          id?: string
          identifier?: string
          model_id?: number
          source?: string
          user_id?: string | null
          version?: number
        }
        Relationships: []
      }
      apps: {
        Row: {
          created_at: string
          description: string | null
          github_repo_url: string | null
          id: string
          last_ping: string | null
          name: string
          status: string
          updated_at: string
          url: string | null
          vercel_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          github_repo_url?: string | null
          id?: string
          last_ping?: string | null
          name: string
          status?: string
          updated_at?: string
          url?: string | null
          vercel_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          github_repo_url?: string | null
          id?: string
          last_ping?: string | null
          name?: string
          status?: string
          updated_at?: string
          url?: string | null
          vercel_url?: string | null
        }
        Relationships: []
      }
      auth_model_results: {
        Row: {
          citations: Json | null
          confidence: number | null
          created_at: string | null
          error: string | null
          event_id: string | null
          id: string
          latency_ms: number | null
          model_id: string
          rationale: string | null
          status: string | null
          updated_at: string | null
          verdict: string | null
        }
        Insert: {
          citations?: Json | null
          confidence?: number | null
          created_at?: string | null
          error?: string | null
          event_id?: string | null
          id?: string
          latency_ms?: number | null
          model_id: string
          rationale?: string | null
          status?: string | null
          updated_at?: string | null
          verdict?: string | null
        }
        Update: {
          citations?: Json | null
          confidence?: number | null
          created_at?: string | null
          error?: string | null
          event_id?: string | null
          id?: string
          latency_ms?: number | null
          model_id?: string
          rationale?: string | null
          status?: string | null
          updated_at?: string | null
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auth_model_results_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auth_model_results_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "prompts_latest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auth_model_results_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "prompts_public"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_reports: {
        Row: {
          accepted: boolean | null
          confidence: number
          created_at: string
          errors: Json | null
          id: string
          model: string
          prompt_id: string
          provider: string
          sources: Json | null
          suggested_fixes: Json | null
          verdict: string
        }
        Insert: {
          accepted?: boolean | null
          confidence: number
          created_at?: string
          errors?: Json | null
          id?: string
          model: string
          prompt_id: string
          provider: string
          sources?: Json | null
          suggested_fixes?: Json | null
          verdict: string
        }
        Update: {
          accepted?: boolean | null
          confidence?: number
          created_at?: string
          errors?: Json | null
          id?: string
          model?: string
          prompt_id?: string
          provider?: string
          sources?: Json | null
          suggested_fixes?: Json | null
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "auth_reports_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auth_reports_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_latest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auth_reports_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_public"
            referencedColumns: ["id"]
          },
        ]
      }
      avatars: {
        Row: {
          birth_city: string | null
          birth_country: string | null
          birth_day: string | null
          birth_gps_coordinates: string | null
          created_at: string | null
          death_city: string | null
          death_country: string | null
          death_day: string | null
          death_gps_coordinates: string | null
          description: string | null
          firebase_size_kb: string | null
          firebase_url: string | null
          first_name: string | null
          gender: string | null
          id: string
          image_url: string | null
          last_name: string
          ready: boolean | null
          source_citation: string | null
        }
        Insert: {
          birth_city?: string | null
          birth_country?: string | null
          birth_day?: string | null
          birth_gps_coordinates?: string | null
          created_at?: string | null
          death_city?: string | null
          death_country?: string | null
          death_day?: string | null
          death_gps_coordinates?: string | null
          description?: string | null
          firebase_size_kb?: string | null
          firebase_url?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          last_name: string
          ready?: boolean | null
          source_citation?: string | null
        }
        Update: {
          birth_city?: string | null
          birth_country?: string | null
          birth_day?: string | null
          birth_gps_coordinates?: string | null
          created_at?: string | null
          death_city?: string | null
          death_country?: string | null
          death_day?: string | null
          death_gps_coordinates?: string | null
          description?: string | null
          firebase_size_kb?: string | null
          firebase_url?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          image_url?: string | null
          last_name?: string
          ready?: boolean | null
          source_citation?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          name: string
          requirement_code: string | null
          requirement_value: number | null
          slug: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name: string
          requirement_code?: string | null
          requirement_value?: number | null
          slug: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          name?: string
          requirement_code?: string | null
          requirement_value?: number | null
          slug?: string
        }
        Relationships: []
      }
      collection_jobs: {
        Row: {
          created_at: string
          cron_expression: string | null
          date_filter_end: string | null
          date_filter_start: string | null
          description: string | null
          error_message: string | null
          id: string
          is_active: boolean
          last_run: string | null
          name: string
          next_run: string | null
          schedule: string
          status: string
          total_events_collected: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          cron_expression?: string | null
          date_filter_end?: string | null
          date_filter_start?: string | null
          description?: string | null
          error_message?: string | null
          id?: string
          is_active?: boolean
          last_run?: string | null
          name: string
          next_run?: string | null
          schedule: string
          status?: string
          total_events_collected?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          cron_expression?: string | null
          date_filter_end?: string | null
          date_filter_start?: string | null
          description?: string | null
          error_message?: string | null
          id?: string
          is_active?: boolean
          last_run?: string | null
          name?: string
          next_run?: string | null
          schedule?: string
          status?: string
          total_events_collected?: number
          updated_at?: string
        }
        Relationships: []
      }
      collection_runs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          events_found: number
          events_saved: number
          id: string
          images_saved: number
          job_id: string | null
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          events_found?: number
          events_saved?: number
          id?: string
          images_saved?: number
          job_id?: string | null
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          events_found?: number
          events_saved?: number
          id?: string
          images_saved?: number
          job_id?: string | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_runs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "collection_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      compete_host_diagnostics: {
        Row: {
          connected_count: number
          created_at: string | null
          grace_ms: number | null
          id: string
          next_host_key: string | null
          occurred_at_ms: number
          previous_host_key: string | null
          reason: string
          room_id: string
          scheduled_at_ms: number
        }
        Insert: {
          connected_count?: number
          created_at?: string | null
          grace_ms?: number | null
          id?: string
          next_host_key?: string | null
          occurred_at_ms: number
          previous_host_key?: string | null
          reason: string
          room_id: string
          scheduled_at_ms: number
        }
        Update: {
          connected_count?: number
          created_at?: string | null
          grace_ms?: number | null
          id?: string
          next_host_key?: string | null
          occurred_at_ms?: number
          previous_host_key?: string | null
          reason?: string
          room_id?: string
          scheduled_at_ms?: number
        }
        Relationships: []
      }
      evidence_cache: {
        Row: {
          created_at: string | null
          event_id: string | null
          evidence: Json | null
          evidence_hash: string | null
          id: string
          sources: Json | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          evidence?: Json | null
          evidence_hash?: string | null
          id?: string
          sources?: Json | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          evidence?: Json | null
          evidence_hash?: string | null
          id?: string
          sources?: Json | null
        }
        Relationships: []
      }
      external_links: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      friends: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      fun_facts: {
        Row: {
          created_at: string
          date: number
          description: string
          id: number
          location: string
        }
        Insert: {
          created_at?: string
          date?: number
          description: string
          id?: number
          location?: string
        }
        Update: {
          created_at?: string
          date?: number
          description?: string
          id?: number
          location?: string
        }
        Relationships: []
      }
      fun_facts_backup: {
        Row: {
          created_at: string | null
          description: string | null
          id: number | null
          location: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number | null
          location?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number | null
          location?: string | null
          year?: number | null
        }
        Relationships: []
      }
      gallery_image_events: {
        Row: {
          image_id: string
          qid: string
          source: string
        }
        Insert: {
          image_id: string
          qid: string
          source: string
        }
        Update: {
          image_id?: string
          qid?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_image_events_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "gallery_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_image_events_qid_fkey"
            columns: ["qid"]
            isOneToOne: false
            referencedRelation: "wiki"
            referencedColumns: ["qid"]
          },
        ]
      }
      gallery_images: {
        Row: {
          created_at: string
          credit: string | null
          date_created: string | null
          date_precision: number | null
          description_html: string | null
          file_title: string
          height: number | null
          id: string
          image_url: string
          lat: number | null
          license_name: string | null
          license_url: string | null
          location_label: string | null
          location_qid: string | null
          lon: number | null
          mime: string | null
          source_page: string | null
          thumb_url: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          created_at?: string
          credit?: string | null
          date_created?: string | null
          date_precision?: number | null
          description_html?: string | null
          file_title: string
          height?: number | null
          id?: string
          image_url: string
          lat?: number | null
          license_name?: string | null
          license_url?: string | null
          location_label?: string | null
          location_qid?: string | null
          lon?: number | null
          mime?: string | null
          source_page?: string | null
          thumb_url?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          created_at?: string
          credit?: string | null
          date_created?: string | null
          date_precision?: number | null
          description_html?: string | null
          file_title?: string
          height?: number | null
          id?: string
          image_url?: string
          lat?: number | null
          license_name?: string | null
          license_url?: string | null
          location_label?: string | null
          location_qid?: string | null
          lon?: number | null
          mime?: string | null
          source_page?: string | null
          thumb_url?: string | null
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      game_config: {
        Row: {
          config: Json
          id: string
          updated_at: string | null
        }
        Insert: {
          config?: Json
          id?: string
          updated_at?: string | null
        }
        Update: {
          config?: Json
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      game_rounds: {
        Row: {
          created_at: string | null
          game_id: string
          id: string
          image_id: string
          round_index: number
        }
        Insert: {
          created_at?: string | null
          game_id: string
          id?: string
          image_id: string
          round_index: number
        }
        Update: {
          created_at?: string | null
          game_id?: string
          id?: string
          image_id?: string
          round_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_rounds_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          created_at: string | null
          current_round_number: number
          end_reason: string | null
          ended_at: string | null
          game_status: string | null
          image_ids: string[]
          is_async: boolean | null
          max_days_per_move: number | null
          room_id: string
          seed: string
          started_at: string
          timer_enabled: boolean | null
          timer_seconds: number | null
        }
        Insert: {
          created_at?: string | null
          current_round_number?: number
          end_reason?: string | null
          ended_at?: string | null
          game_status?: string | null
          image_ids: string[]
          is_async?: boolean | null
          max_days_per_move?: number | null
          room_id: string
          seed: string
          started_at?: string
          timer_enabled?: boolean | null
          timer_seconds?: number | null
        }
        Update: {
          created_at?: string | null
          current_round_number?: number
          end_reason?: string | null
          ended_at?: string | null
          game_status?: string | null
          image_ids?: string[]
          is_async?: boolean | null
          max_days_per_move?: number | null
          room_id?: string
          seed?: string
          started_at?: string
          timer_enabled?: boolean | null
          timer_seconds?: number | null
        }
        Relationships: []
      }
      games: {
        Row: {
          completed: boolean | null
          created_at: string | null
          created_by: string | null
          current_round: number | null
          guest_id: string | null
          id: string
          mode: string
          round_count: number | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          created_by?: string | null
          current_round?: number | null
          guest_id?: string | null
          id?: string
          mode: string
          round_count?: number | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          created_by?: string | null
          current_round?: number | null
          guest_id?: string | null
          id?: string
          mode?: string
          round_count?: number | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      guesses: {
        Row: {
          accuracy: number | null
          created_at: string | null
          game_id: string
          guess_lat: number
          guess_lon: number
          guess_year: number
          id: string
          image_id: string
          is_fallback_location: boolean | null
          round_index: number
          user_id: string | null
        }
        Insert: {
          accuracy?: number | null
          created_at?: string | null
          game_id: string
          guess_lat: number
          guess_lon: number
          guess_year: number
          id?: string
          image_id: string
          is_fallback_location?: boolean | null
          round_index: number
          user_id?: string | null
        }
        Update: {
          accuracy?: number | null
          created_at?: string | null
          game_id?: string
          guess_lat?: number
          guess_lon?: number
          guess_year?: number
          id?: string
          image_id?: string
          is_fallback_location?: boolean | null
          round_index?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guesses_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      image_feedbacks: {
        Row: {
          additional_comments: string | null
          created_at: string
          date_accurate: boolean | null
          description_accurate: boolean | null
          id: number
          image_accuracy: number
          image_id: string
          location_accurate: boolean | null
          user_id: string
        }
        Insert: {
          additional_comments?: string | null
          created_at?: string
          date_accurate?: boolean | null
          description_accurate?: boolean | null
          id?: number
          image_accuracy: number
          image_id: string
          location_accurate?: boolean | null
          user_id: string
        }
        Update: {
          additional_comments?: string | null
          created_at?: string
          date_accurate?: boolean | null
          description_accurate?: boolean | null
          id?: number
          image_accuracy?: number
          image_id?: string
          location_accurate?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_feedbacks_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          "1_when_century": string | null
          "1_where_continent": string | null
          "2_when_event": string | null
          "2_when_event_years": string | null
          "2_where_landmark": string | null
          "2_where_landmark_km": number | null
          "3_when_decade": string | null
          "3_where_region": string | null
          "4_when_event": string | null
          "4_when_event_years": number | null
          "4_where_landmark": string | null
          "4_where_landmark_km": number | null
          "5_when_clues": string | null
          "5_where_clues": string | null
          accuracy_score: Json | null
          ai_generated: boolean | null
          approx_people_count: number | null
          aspect_ratio: string | null
          binary: string | null
          celebrity: boolean | null
          cfg_scale: number | null
          confidence: number | null
          content_hash: string | null
          cost: number | null
          country: string | null
          created_at: string
          date: string | null
          description: string | null
          desktop_image_url: string | null
          desktop_size_kb: number | null
          exact_date: string | null
          firebase_desktop: string | null
          firebase_desktop_kb: number | null
          firebase_mobile: string | null
          firebase_mobile_kb: number | null
          firebase_size_kb: number | null
          firebase_url: string | null
          gps_coordinates: string | null
          has_full_hints: boolean | null
          height: number | null
          hint_suggestion_first_landmark: string | null
          id: string
          image_url: string | null
          key_elements: string | null
          last_verified: string | null
          latitude: number | null
          location: string | null
          location_name: string | null
          longitude: number | null
          manually_used: boolean
          mature_content: boolean | null
          mobile_image_url: string | null
          mobile_size_kb: number | null
          model: string | null
          negative_prompt: string | null
          optimized_image_url: string | null
          original_size_kb: number | null
          output_format: string | null
          positive_prompt: string | null
          prompt: string
          prompt_id: string | null
          ready: boolean | null
          real_event: boolean | null
          scheduler: string | null
          seed: number | null
          source_citation: string | null
          steps: number | null
          theme: string | null
          thumbnail_image_url: string | null
          title: string | null
          user_id: string
          validation_issues: string | null
          width: number | null
          year: number | null
        }
        Insert: {
          "1_when_century"?: string | null
          "1_where_continent"?: string | null
          "2_when_event"?: string | null
          "2_when_event_years"?: string | null
          "2_where_landmark"?: string | null
          "2_where_landmark_km"?: number | null
          "3_when_decade"?: string | null
          "3_where_region"?: string | null
          "4_when_event"?: string | null
          "4_when_event_years"?: number | null
          "4_where_landmark"?: string | null
          "4_where_landmark_km"?: number | null
          "5_when_clues"?: string | null
          "5_where_clues"?: string | null
          accuracy_score?: Json | null
          ai_generated?: boolean | null
          approx_people_count?: number | null
          aspect_ratio?: string | null
          binary?: string | null
          celebrity?: boolean | null
          cfg_scale?: number | null
          confidence?: number | null
          content_hash?: string | null
          cost?: number | null
          country?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          desktop_image_url?: string | null
          desktop_size_kb?: number | null
          exact_date?: string | null
          firebase_desktop?: string | null
          firebase_desktop_kb?: number | null
          firebase_mobile?: string | null
          firebase_mobile_kb?: number | null
          firebase_size_kb?: number | null
          firebase_url?: string | null
          gps_coordinates?: string | null
          has_full_hints?: boolean | null
          height?: number | null
          hint_suggestion_first_landmark?: string | null
          id?: string
          image_url?: string | null
          key_elements?: string | null
          last_verified?: string | null
          latitude?: number | null
          location?: string | null
          location_name?: string | null
          longitude?: number | null
          manually_used?: boolean
          mature_content?: boolean | null
          mobile_image_url?: string | null
          mobile_size_kb?: number | null
          model?: string | null
          negative_prompt?: string | null
          optimized_image_url?: string | null
          original_size_kb?: number | null
          output_format?: string | null
          positive_prompt?: string | null
          prompt: string
          prompt_id?: string | null
          ready?: boolean | null
          real_event?: boolean | null
          scheduler?: string | null
          seed?: number | null
          source_citation?: string | null
          steps?: number | null
          theme?: string | null
          thumbnail_image_url?: string | null
          title?: string | null
          user_id: string
          validation_issues?: string | null
          width?: number | null
          year?: number | null
        }
        Update: {
          "1_when_century"?: string | null
          "1_where_continent"?: string | null
          "2_when_event"?: string | null
          "2_when_event_years"?: string | null
          "2_where_landmark"?: string | null
          "2_where_landmark_km"?: number | null
          "3_when_decade"?: string | null
          "3_where_region"?: string | null
          "4_when_event"?: string | null
          "4_when_event_years"?: number | null
          "4_where_landmark"?: string | null
          "4_where_landmark_km"?: number | null
          "5_when_clues"?: string | null
          "5_where_clues"?: string | null
          accuracy_score?: Json | null
          ai_generated?: boolean | null
          approx_people_count?: number | null
          aspect_ratio?: string | null
          binary?: string | null
          celebrity?: boolean | null
          cfg_scale?: number | null
          confidence?: number | null
          content_hash?: string | null
          cost?: number | null
          country?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          desktop_image_url?: string | null
          desktop_size_kb?: number | null
          exact_date?: string | null
          firebase_desktop?: string | null
          firebase_desktop_kb?: number | null
          firebase_mobile?: string | null
          firebase_mobile_kb?: number | null
          firebase_size_kb?: number | null
          firebase_url?: string | null
          gps_coordinates?: string | null
          has_full_hints?: boolean | null
          height?: number | null
          hint_suggestion_first_landmark?: string | null
          id?: string
          image_url?: string | null
          key_elements?: string | null
          last_verified?: string | null
          latitude?: number | null
          location?: string | null
          location_name?: string | null
          longitude?: number | null
          manually_used?: boolean
          mature_content?: boolean | null
          mobile_image_url?: string | null
          mobile_size_kb?: number | null
          model?: string | null
          negative_prompt?: string | null
          optimized_image_url?: string | null
          original_size_kb?: number | null
          output_format?: string | null
          positive_prompt?: string | null
          prompt?: string
          prompt_id?: string | null
          ready?: boolean | null
          real_event?: boolean | null
          scheduler?: string | null
          seed?: number | null
          source_citation?: string | null
          steps?: number | null
          theme?: string | null
          thumbnail_image_url?: string | null
          title?: string | null
          user_id?: string
          validation_issues?: string | null
          width?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "images_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "images_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_latest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "images_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_public"
            referencedColumns: ["id"]
          },
        ]
      }
      migration_ledger: {
        Row: {
          applied_at: string
          migration_id: string
        }
        Insert: {
          applied_at?: string
          migration_id: string
        }
        Update: {
          applied_at?: string
          migration_id?: string
        }
        Relationships: []
      }
      partykit_logs: {
        Row: {
          connection_id: string | null
          created_at: string | null
          emitted_at: string | null
          event_type: string
          id: string
          participant_key: string | null
          payload: Json | null
          player_id: string | null
          room_id: string
          severity: string
        }
        Insert: {
          connection_id?: string | null
          created_at?: string | null
          emitted_at?: string | null
          event_type: string
          id?: string
          participant_key?: string | null
          payload?: Json | null
          player_id?: string | null
          room_id: string
          severity?: string
        }
        Update: {
          connection_id?: string | null
          created_at?: string | null
          emitted_at?: string | null
          event_type?: string
          id?: string
          participant_key?: string | null
          payload?: Json | null
          player_id?: string | null
          room_id?: string
          severity?: string
        }
        Relationships: []
      }
      played_images: {
        Row: {
          id: string
          image_id: string
          played_at: string
          user_id: string
        }
        Insert: {
          id?: string
          image_id: string
          played_at?: string
          user_id: string
        }
        Update: {
          id?: string
          image_id?: string
          played_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "played_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_id: string | null
          avatar_image_url: string | null
          avatar_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          earned_badges: Json
          full_name: string | null
          id: string
          is_admin: boolean | null
          is_ai: boolean
          is_guest: boolean
          level_up_best_level: number
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_id?: string | null
          avatar_image_url?: string | null
          avatar_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          earned_badges?: Json
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          is_ai?: boolean
          is_guest?: boolean
          level_up_best_level?: number
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_id?: string | null
          avatar_image_url?: string | null
          avatar_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          earned_badges?: Json
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_ai?: boolean
          is_guest?: boolean
          level_up_best_level?: number
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          created_at: string | null
          depends_on: string | null
          id: string
          owner: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          depends_on?: string | null
          id: string
          owner: string
          status: string
          title: string
        }
        Update: {
          created_at?: string | null
          depends_on?: string | null
          id?: string
          owner?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      prompt_verifications: {
        Row: {
          citations: Json | null
          created_at: string | null
          id: number
          issues: Json
          notes: string | null
          operation: string
          payload: Json | null
          prompt_id: string
          status: string
        }
        Insert: {
          citations?: Json | null
          created_at?: string | null
          id?: number
          issues?: Json
          notes?: string | null
          operation?: string
          payload?: Json | null
          prompt_id: string
          status: string
        }
        Update: {
          citations?: Json | null
          created_at?: string | null
          id?: number
          issues?: Json
          notes?: string | null
          operation?: string
          payload?: Json | null
          prompt_id?: string
          status?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          "1_when_century": string | null
          "1_where_continent": string | null
          "2_when_event": string | null
          "2_when_event_years": string | null
          "2_where_landmark": string | null
          "2_where_landmark_km": number | null
          "3_when_decade": string | null
          "3_where_region": string | null
          "4_when_event": string | null
          "4_when_event_years": number | null
          "4_where_landmark": string | null
          "4_where_landmark_km": number | null
          "5_when_clues": string | null
          "5_where_clues": string | null
          ai_generated: boolean | null
          approx_people_count: number | null
          authenticity_confidence: number | null
          authenticity_verdict: string | null
          auto_fix_attempts: number | null
          celebrity: boolean | null
          confidence: number | null
          country: string | null
          created_at: string
          date: string | null
          description: string | null
          fingerprint: string | null
          gps_coordinates: string | null
          has_full_hints: boolean | null
          hint_verification_details: Json | null
          hints_validated: boolean | null
          hints_verified: boolean | null
          id: string
          is_ready: boolean
          key_elements: string | null
          last_verified: string | null
          latitude: number | null
          location: string | null
          location_name: string | null
          location_strict_ok: boolean | null
          location_verification_source: string | null
          location_verified: boolean | null
          longitude: number | null
          manually_used: boolean
          metadata_accuracy_score: number | null
          metadata_confidence_score: number | null
          myth: boolean
          negative_prompt: string | null
          prompt: string
          real_event: string | null
          source_citation: string | null
          source_citation_2: string | null
          source_citation_3: string | null
          theme: string | null
          title: string | null
          used: boolean | null
          user_id: string
          verification_citations: Json
          verification_explanation: string | null
          verification_failures: Json | null
          verification_models: string[] | null
          verification_report: Json | null
          verification_source_count: number | null
          verification_sources: string[] | null
          verification_status: string | null
          verified_by: string | null
          verified_lat: number | null
          verified_location_name: string | null
          verified_lon: number | null
          verified_year: number | null
          year: number | null
          year_strict_ok: boolean | null
          year_verification_source: string | null
          year_verified: boolean | null
        }
        Insert: {
          "1_when_century"?: string | null
          "1_where_continent"?: string | null
          "2_when_event"?: string | null
          "2_when_event_years"?: string | null
          "2_where_landmark"?: string | null
          "2_where_landmark_km"?: number | null
          "3_when_decade"?: string | null
          "3_where_region"?: string | null
          "4_when_event"?: string | null
          "4_when_event_years"?: number | null
          "4_where_landmark"?: string | null
          "4_where_landmark_km"?: number | null
          "5_when_clues"?: string | null
          "5_where_clues"?: string | null
          ai_generated?: boolean | null
          approx_people_count?: number | null
          authenticity_confidence?: number | null
          authenticity_verdict?: string | null
          auto_fix_attempts?: number | null
          celebrity?: boolean | null
          confidence?: number | null
          country?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          fingerprint?: string | null
          gps_coordinates?: string | null
          has_full_hints?: boolean | null
          hint_verification_details?: Json | null
          hints_validated?: boolean | null
          hints_verified?: boolean | null
          id?: string
          is_ready?: boolean
          key_elements?: string | null
          last_verified?: string | null
          latitude?: number | null
          location?: string | null
          location_name?: string | null
          location_strict_ok?: boolean | null
          location_verification_source?: string | null
          location_verified?: boolean | null
          longitude?: number | null
          manually_used?: boolean
          metadata_accuracy_score?: number | null
          metadata_confidence_score?: number | null
          myth?: boolean
          negative_prompt?: string | null
          prompt: string
          real_event?: string | null
          source_citation?: string | null
          source_citation_2?: string | null
          source_citation_3?: string | null
          theme?: string | null
          title?: string | null
          used?: boolean | null
          user_id: string
          verification_citations?: Json
          verification_explanation?: string | null
          verification_failures?: Json | null
          verification_models?: string[] | null
          verification_report?: Json | null
          verification_source_count?: number | null
          verification_sources?: string[] | null
          verification_status?: string | null
          verified_by?: string | null
          verified_lat?: number | null
          verified_location_name?: string | null
          verified_lon?: number | null
          verified_year?: number | null
          year?: number | null
          year_strict_ok?: boolean | null
          year_verification_source?: string | null
          year_verified?: boolean | null
        }
        Update: {
          "1_when_century"?: string | null
          "1_where_continent"?: string | null
          "2_when_event"?: string | null
          "2_when_event_years"?: string | null
          "2_where_landmark"?: string | null
          "2_where_landmark_km"?: number | null
          "3_when_decade"?: string | null
          "3_where_region"?: string | null
          "4_when_event"?: string | null
          "4_when_event_years"?: number | null
          "4_where_landmark"?: string | null
          "4_where_landmark_km"?: number | null
          "5_when_clues"?: string | null
          "5_where_clues"?: string | null
          ai_generated?: boolean | null
          approx_people_count?: number | null
          authenticity_confidence?: number | null
          authenticity_verdict?: string | null
          auto_fix_attempts?: number | null
          celebrity?: boolean | null
          confidence?: number | null
          country?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          fingerprint?: string | null
          gps_coordinates?: string | null
          has_full_hints?: boolean | null
          hint_verification_details?: Json | null
          hints_validated?: boolean | null
          hints_verified?: boolean | null
          id?: string
          is_ready?: boolean
          key_elements?: string | null
          last_verified?: string | null
          latitude?: number | null
          location?: string | null
          location_name?: string | null
          location_strict_ok?: boolean | null
          location_verification_source?: string | null
          location_verified?: boolean | null
          longitude?: number | null
          manually_used?: boolean
          metadata_accuracy_score?: number | null
          metadata_confidence_score?: number | null
          myth?: boolean
          negative_prompt?: string | null
          prompt?: string
          real_event?: string | null
          source_citation?: string | null
          source_citation_2?: string | null
          source_citation_3?: string | null
          theme?: string | null
          title?: string | null
          used?: boolean | null
          user_id?: string
          verification_citations?: Json
          verification_explanation?: string | null
          verification_failures?: Json | null
          verification_models?: string[] | null
          verification_report?: Json | null
          verification_source_count?: number | null
          verification_sources?: string[] | null
          verification_status?: string | null
          verified_by?: string | null
          verified_lat?: number | null
          verified_location_name?: string | null
          verified_lon?: number | null
          verified_year?: number | null
          year?: number | null
          year_strict_ok?: boolean | null
          year_verification_source?: string | null
          year_verified?: boolean | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          expiration_time: number | null
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          expiration_time?: number | null
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          expiration_time?: number | null
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          author: string
          created_at: string
          id: number
          invalid_reason: string | null
          is_valid: boolean | null
          location: string | null
          quote_text: string
          year: number | null
        }
        Insert: {
          author: string
          created_at?: string
          id?: number
          invalid_reason?: string | null
          is_valid?: boolean | null
          location?: string | null
          quote_text: string
          year?: number | null
        }
        Update: {
          author?: string
          created_at?: string
          id?: number
          invalid_reason?: string | null
          is_valid?: boolean | null
          location?: string | null
          quote_text?: string
          year?: number | null
        }
        Relationships: []
      }
      quotes_clean: {
        Row: {
          author: string | null
          id: number | null
          location: string | null
          quote_text: string | null
          year: number | null
        }
        Insert: {
          author?: string | null
          id?: number | null
          location?: string | null
          quote_text?: string | null
          year?: number | null
        }
        Update: {
          author?: string | null
          id?: number | null
          location?: string | null
          quote_text?: string | null
          year?: number | null
        }
        Relationships: []
      }
      room_chat: {
        Row: {
          created_at: string
          id: string
          message: string
          room_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          room_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          room_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      room_event_log: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json | null
          room_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload?: Json | null
          room_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json | null
          room_id?: string
        }
        Relationships: []
      }
      room_invitations: {
        Row: {
          created_at: string
          id: string
          invite_url: string
          mode: string
          read_at: string | null
          recipient_id: string
          room_id: string
          sender_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          invite_url: string
          mode: string
          read_at?: string | null
          recipient_id: string
          room_id: string
          sender_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          invite_url?: string
          mode?: string
          read_at?: string | null
          recipient_id?: string
          room_id?: string
          sender_id?: string
          status?: string
        }
        Relationships: []
      }
      room_invites: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          inviter_user_id: string
          is_async: boolean | null
          room_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          inviter_user_id: string
          is_async?: boolean | null
          room_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          inviter_user_id?: string
          is_async?: boolean | null
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_invites_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      room_rounds: {
        Row: {
          duration_sec: number
          finalized_payload: Json | null
          room_id: string
          round_number: number
          started_at: string
        }
        Insert: {
          duration_sec?: number
          finalized_payload?: Json | null
          room_id: string
          round_number: number
          started_at?: string
        }
        Update: {
          duration_sec?: number
          finalized_payload?: Json | null
          room_id?: string
          round_number?: number
          started_at?: string
        }
        Relationships: []
      }
      round_hints: {
        Row: {
          acc_debt: number
          hint_id: string
          hint_subtype: string | null
          hint_type: string | null
          id: string
          label: string | null
          purchased_at: string
          round_id: string
          user_id: string
          xp_debt: number
        }
        Insert: {
          acc_debt?: number
          hint_id: string
          hint_subtype?: string | null
          hint_type?: string | null
          id?: string
          label?: string | null
          purchased_at?: string
          round_id: string
          user_id: string
          xp_debt?: number
        }
        Update: {
          acc_debt?: number
          hint_id?: string
          hint_subtype?: string | null
          hint_type?: string | null
          id?: string
          label?: string | null
          purchased_at?: string
          round_id?: string
          user_id?: string
          xp_debt?: number
        }
        Relationships: []
      }
      round_results: {
        Row: {
          acc_debt: number
          accuracy: number | null
          actual_lat: number | null
          actual_lng: number | null
          created_at: string | null
          distance_km: number | null
          game_id: string
          guess_lat: number | null
          guess_lng: number | null
          guess_year: number | null
          hints_used: number | null
          id: string
          image_id: string
          location_accuracy: number
          location_canonical_id: string | null
          location_distance_meters: number | null
          location_match: boolean | null
          location_normalized: Json | null
          location_raw: Json | null
          room_id: string | null
          round_index: number
          score: number | null
          time_accuracy: number
          updated_at: string | null
          user_id: string
          xp_debt: number
          xp_total: number
          xp_when: number | null
          xp_where: number | null
          year_difference: number | null
        }
        Insert: {
          acc_debt?: number
          accuracy?: number | null
          actual_lat?: number | null
          actual_lng?: number | null
          created_at?: string | null
          distance_km?: number | null
          game_id: string
          guess_lat?: number | null
          guess_lng?: number | null
          guess_year?: number | null
          hints_used?: number | null
          id?: string
          image_id: string
          location_accuracy?: number
          location_canonical_id?: string | null
          location_distance_meters?: number | null
          location_match?: boolean | null
          location_normalized?: Json | null
          location_raw?: Json | null
          room_id?: string | null
          round_index: number
          score?: number | null
          time_accuracy?: number
          updated_at?: string | null
          user_id: string
          xp_debt?: number
          xp_total?: number
          xp_when?: number | null
          xp_where?: number | null
          year_difference?: number | null
        }
        Update: {
          acc_debt?: number
          accuracy?: number | null
          actual_lat?: number | null
          actual_lng?: number | null
          created_at?: string | null
          distance_km?: number | null
          game_id?: string
          guess_lat?: number | null
          guess_lng?: number | null
          guess_year?: number | null
          hints_used?: number | null
          id?: string
          image_id?: string
          location_accuracy?: number
          location_canonical_id?: string | null
          location_distance_meters?: number | null
          location_match?: boolean | null
          location_normalized?: Json | null
          location_raw?: Json | null
          room_id?: string | null
          round_index?: number
          score?: number | null
          time_accuracy?: number
          updated_at?: string | null
          user_id?: string
          xp_debt?: number
          xp_total?: number
          xp_when?: number | null
          xp_where?: number | null
          year_difference?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "round_results_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      round_timers: {
        Row: {
          created_at: string
          duration_sec: number
          end_at: string
          started_at: string
          started_by: string | null
          timer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_sec: number
          end_at: string
          started_at?: string
          started_by?: string | null
          timer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_sec?: number
          end_at?: string
          started_at?: string
          started_by?: string | null
          timer_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_players: {
        Row: {
          active: boolean
          display_name: string | null
          inserted_at: string
          is_host: boolean
          joined_at: string
          kicked_at: string | null
          last_activity_at: string | null
          last_seen: string
          ready: boolean
          results_ready_rounds: number[]
          room_id: string
          timeout_reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          display_name?: string | null
          inserted_at?: string
          is_host?: boolean
          joined_at?: string
          kicked_at?: string | null
          last_activity_at?: string | null
          last_seen?: string
          ready?: boolean
          results_ready_rounds?: number[]
          room_id: string
          timeout_reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          display_name?: string | null
          inserted_at?: string
          is_host?: boolean
          joined_at?: string
          kicked_at?: string | null
          last_activity_at?: string | null
          last_seen?: string
          ready?: boolean
          results_ready_rounds?: number[]
          room_id?: string
          timeout_reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_players_results_ready: {
        Row: {
          created_at: string
          ready: boolean
          room_id: string
          round_number: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ready?: boolean
          room_id: string
          round_number: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ready?: boolean
          room_id?: string
          round_number?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_progress: {
        Row: {
          current_route: string | null
          duration_sec: number | null
          inserted_at: string
          room_id: string
          round_index: number
          round_number: number | null
          submitted: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          current_route?: string | null
          duration_sec?: number | null
          inserted_at?: string
          room_id: string
          round_index: number
          round_number?: number | null
          submitted?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          current_route?: string | null
          duration_sec?: number | null
          inserted_at?: string
          room_id?: string
          round_index?: number
          round_number?: number | null
          submitted?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          key: string | null
          updated_at: string | null
          value: Json
        }
        Insert: {
          id: string
          key?: string | null
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string | null
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          created_at: string
          description: string
          email: string | null
          id: string
          status: string
          topic: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          email?: string | null
          id?: string
          status?: string
          topic?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          email?: string | null
          id?: string
          status?: string
          topic?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_guess_events: {
        Row: {
          player_id: string
          room_id: string
          round_index: number
          submitted_at: string
        }
        Insert: {
          player_id: string
          room_id: string
          round_index: number
          submitted_at?: string
        }
        Update: {
          player_id?: string
          room_id?: string
          round_index?: number
          submitted_at?: string
        }
        Relationships: []
      }
      sync_room_players: {
        Row: {
          active: boolean
          display_name: string | null
          room_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          display_name?: string | null
          room_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          display_name?: string | null
          room_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sync_round_scores: {
        Row: {
          acc_debt: number
          display_name: string | null
          distance_km: number | null
          guess_lat: number | null
          guess_lng: number | null
          guess_year: number | null
          hints_used: number
          location_accuracy: number | null
          location_canonical_id: string | null
          location_distance_meters: number | null
          location_match: boolean | null
          location_normalized: Json | null
          location_raw: Json | null
          net_location_accuracy: number
          net_percent: number
          net_time_accuracy: number
          room_id: string
          round_number: number
          submitted_at: string | null
          time_accuracy: number | null
          user_id: string
          xp_debt: number
          xp_total: number | null
          year_difference: number | null
        }
        Insert: {
          acc_debt?: number
          display_name?: string | null
          distance_km?: number | null
          guess_lat?: number | null
          guess_lng?: number | null
          guess_year?: number | null
          hints_used?: number
          location_accuracy?: number | null
          location_canonical_id?: string | null
          location_distance_meters?: number | null
          location_match?: boolean | null
          location_normalized?: Json | null
          location_raw?: Json | null
          net_location_accuracy?: number
          net_percent?: number
          net_time_accuracy?: number
          room_id: string
          round_number: number
          submitted_at?: string | null
          time_accuracy?: number | null
          user_id: string
          xp_debt?: number
          xp_total?: number | null
          year_difference?: number | null
        }
        Update: {
          acc_debt?: number
          display_name?: string | null
          distance_km?: number | null
          guess_lat?: number | null
          guess_lng?: number | null
          guess_year?: number | null
          hints_used?: number
          location_accuracy?: number | null
          location_canonical_id?: string | null
          location_distance_meters?: number | null
          location_match?: boolean | null
          location_normalized?: Json | null
          location_raw?: Json | null
          net_location_accuracy?: number
          net_percent?: number
          net_time_accuracy?: number
          room_id?: string
          round_number?: number
          submitted_at?: string | null
          time_accuracy?: number | null
          user_id?: string
          xp_debt?: number
          xp_total?: number | null
          year_difference?: number | null
        }
        Relationships: []
      }
      trash: {
        Row: {
          "1_when_century": string | null
          "1_where_continent": string | null
          "2_when_event": string | null
          "2_when_event_years": string | null
          "2_where_landmark": string | null
          "2_where_landmark_km": number | null
          "3_when_decade": string | null
          "3_where_region": string | null
          ai_generated: boolean | null
          celebrity: boolean | null
          country: string | null
          created_at: string | null
          date: string | null
          deleted_at: string | null
          description: string | null
          gps_coordinates: string | null
          hint_what: string | null
          hint_when: string | null
          hint_where: string | null
          id: string
          key_elements: string | null
          location: string | null
          original_prompt_id: string
          prompt: string
          real_event: boolean | null
          theme: string | null
          title: string | null
          updated_at: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          "1_when_century"?: string | null
          "1_where_continent"?: string | null
          "2_when_event"?: string | null
          "2_when_event_years"?: string | null
          "2_where_landmark"?: string | null
          "2_where_landmark_km"?: number | null
          "3_when_decade"?: string | null
          "3_where_region"?: string | null
          ai_generated?: boolean | null
          celebrity?: boolean | null
          country?: string | null
          created_at?: string | null
          date?: string | null
          deleted_at?: string | null
          description?: string | null
          gps_coordinates?: string | null
          hint_what?: string | null
          hint_when?: string | null
          hint_where?: string | null
          id?: string
          key_elements?: string | null
          location?: string | null
          original_prompt_id: string
          prompt: string
          real_event?: boolean | null
          theme?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          year?: number | null
        }
        Update: {
          "1_when_century"?: string | null
          "1_where_continent"?: string | null
          "2_when_event"?: string | null
          "2_when_event_years"?: string | null
          "2_where_landmark"?: string | null
          "2_where_landmark_km"?: number | null
          "3_when_decade"?: string | null
          "3_where_region"?: string | null
          ai_generated?: boolean | null
          celebrity?: boolean | null
          country?: string | null
          created_at?: string | null
          date?: string | null
          deleted_at?: string | null
          description?: string | null
          gps_coordinates?: string | null
          hint_what?: string | null
          hint_when?: string | null
          hint_where?: string | null
          id?: string
          key_elements?: string | null
          location?: string | null
          original_prompt_id?: string
          prompt?: string
          real_event?: boolean | null
          theme?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          context: Json | null
          earned_at: string
          id: string
          scope_id: string
          scope_type: string
          user_id: string
        }
        Insert: {
          badge_id: string
          context?: Json | null
          earned_at?: string
          id?: string
          scope_id: string
          scope_type: string
          user_id: string
        }
        Update: {
          badge_id?: string
          context?: Json | null
          earned_at?: string
          id?: string
          scope_id?: string
          scope_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_metrics: {
        Row: {
          best_accuracy: number | null
          challenge_accuracy: number | null
          created_at: string | null
          games_played: number
          games_played_collaborate: number
          games_played_compete: number
          games_played_level: number
          games_played_practice: number
          games_played_solo: number
          global_rank: number | null
          id: string
          location_accuracy: number | null
          location_bullseye: number
          overall_accuracy: number | null
          overall_accuracy_collaborate: number
          overall_accuracy_compete: number
          overall_accuracy_level: number
          overall_accuracy_practice: number
          overall_accuracy_solo: number
          perfect_games: number
          time_accuracy: number | null
          updated_at: string | null
          user_id: string | null
          xp_total: number | null
          xp_total_collaborate: number
          xp_total_compete: number
          xp_total_level: number
          xp_total_practice: number
          xp_total_solo: number
          year_bullseye: number
        }
        Insert: {
          best_accuracy?: number | null
          challenge_accuracy?: number | null
          created_at?: string | null
          games_played?: number
          games_played_collaborate?: number
          games_played_compete?: number
          games_played_level?: number
          games_played_practice?: number
          games_played_solo?: number
          global_rank?: number | null
          id?: string
          location_accuracy?: number | null
          location_bullseye?: number
          overall_accuracy?: number | null
          overall_accuracy_collaborate?: number
          overall_accuracy_compete?: number
          overall_accuracy_level?: number
          overall_accuracy_practice?: number
          overall_accuracy_solo?: number
          perfect_games?: number
          time_accuracy?: number | null
          updated_at?: string | null
          user_id?: string | null
          xp_total?: number | null
          xp_total_collaborate?: number
          xp_total_compete?: number
          xp_total_level?: number
          xp_total_practice?: number
          xp_total_solo?: number
          year_bullseye?: number
        }
        Update: {
          best_accuracy?: number | null
          challenge_accuracy?: number | null
          created_at?: string | null
          games_played?: number
          games_played_collaborate?: number
          games_played_compete?: number
          games_played_level?: number
          games_played_practice?: number
          games_played_solo?: number
          global_rank?: number | null
          id?: string
          location_accuracy?: number | null
          location_bullseye?: number
          overall_accuracy?: number | null
          overall_accuracy_collaborate?: number
          overall_accuracy_compete?: number
          overall_accuracy_level?: number
          overall_accuracy_practice?: number
          overall_accuracy_solo?: number
          perfect_games?: number
          time_accuracy?: number | null
          updated_at?: string | null
          user_id?: string | null
          xp_total?: number | null
          xp_total_collaborate?: number
          xp_total_compete?: number
          xp_total_level?: number
          xp_total_practice?: number
          xp_total_solo?: number
          year_bullseye?: number
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          settings_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verification_evidence: {
        Row: {
          confidence: number | null
          created_at: string | null
          extracted_at: string | null
          field: string
          id: string
          prompt_id: string
          source_domain: string | null
          source_url: string | null
          value: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          extracted_at?: string | null
          field: string
          id?: string
          prompt_id: string
          source_domain?: string | null
          source_url?: string | null
          value?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          extracted_at?: string | null
          field?: string
          id?: string
          prompt_id?: string
          source_domain?: string | null
          source_url?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_evidence_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_evidence_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_latest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_evidence_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_public"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_fixes: {
        Row: {
          applied_at: string | null
          applied_by: string | null
          confidence: number | null
          corrected_value: Json | null
          field: string
          fix_method: string | null
          id: string
          original_value: Json | null
          prompt_id: string
          rollback_at: string | null
          rollback_by: string | null
        }
        Insert: {
          applied_at?: string | null
          applied_by?: string | null
          confidence?: number | null
          corrected_value?: Json | null
          field: string
          fix_method?: string | null
          id?: string
          original_value?: Json | null
          prompt_id: string
          rollback_at?: string | null
          rollback_by?: string | null
        }
        Update: {
          applied_at?: string | null
          applied_by?: string | null
          confidence?: number | null
          corrected_value?: Json | null
          field?: string
          fix_method?: string | null
          id?: string
          original_value?: Json | null
          prompt_id?: string
          rollback_at?: string | null
          rollback_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_fixes_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_fixes_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_latest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_fixes_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts_public"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_runs: {
        Row: {
          auto_fix_enabled: boolean | null
          batch_size: number | null
          error_message: string | null
          failed_count: number | null
          finished_at: string | null
          fixes_applied: number | null
          id: string
          initiated_by: string | null
          manual_review_count: number | null
          metadata: Json | null
          started_at: string | null
          status: string | null
          total_prompts: number
          verified_count: number | null
        }
        Insert: {
          auto_fix_enabled?: boolean | null
          batch_size?: number | null
          error_message?: string | null
          failed_count?: number | null
          finished_at?: string | null
          fixes_applied?: number | null
          id?: string
          initiated_by?: string | null
          manual_review_count?: number | null
          metadata?: Json | null
          started_at?: string | null
          status?: string | null
          total_prompts: number
          verified_count?: number | null
        }
        Update: {
          auto_fix_enabled?: boolean | null
          batch_size?: number | null
          error_message?: string | null
          failed_count?: number | null
          finished_at?: string | null
          fixes_applied?: number | null
          id?: string
          initiated_by?: string | null
          manual_review_count?: number | null
          metadata?: Json | null
          started_at?: string | null
          status?: string | null
          total_prompts?: number
          verified_count?: number | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      wiki: {
        Row: {
          created_at: string
          date_end: string | null
          date_end_precision: number | null
          date_point_in_time: string | null
          date_point_precision: number | null
          date_start: string | null
          date_start_precision: number | null
          description: string | null
          enwiki_title: string | null
          enwiki_url: string | null
          id: string
          lat: number | null
          location_label: string | null
          location_qid: string | null
          lon: number | null
          qid: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_end?: string | null
          date_end_precision?: number | null
          date_point_in_time?: string | null
          date_point_precision?: number | null
          date_start?: string | null
          date_start_precision?: number | null
          description?: string | null
          enwiki_title?: string | null
          enwiki_url?: string | null
          id?: string
          lat?: number | null
          location_label?: string | null
          location_qid?: string | null
          lon?: number | null
          qid: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_end?: string | null
          date_end_precision?: number | null
          date_point_in_time?: string | null
          date_point_precision?: number | null
          date_start?: string | null
          date_start_precision?: number | null
          description?: string | null
          enwiki_title?: string | null
          enwiki_url?: string | null
          id?: string
          lat?: number | null
          location_label?: string | null
          location_qid?: string | null
          lon?: number | null
          qid?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      wiki_images: {
        Row: {
          created_at: string
          credit: string | null
          file_title: string | null
          height: number | null
          id: string
          image_url: string
          is_commons: boolean
          license_name: string | null
          license_url: string | null
          mime: string | null
          qid: string
          source: string
          source_page: string | null
          thumb_url: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          created_at?: string
          credit?: string | null
          file_title?: string | null
          height?: number | null
          id?: string
          image_url: string
          is_commons?: boolean
          license_name?: string | null
          license_url?: string | null
          mime?: string | null
          qid: string
          source: string
          source_page?: string | null
          thumb_url?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          created_at?: string
          credit?: string | null
          file_title?: string | null
          height?: number | null
          id?: string
          image_url?: string
          is_commons?: boolean
          license_name?: string | null
          license_url?: string | null
          mime?: string | null
          qid?: string
          source?: string
          source_page?: string | null
          thumb_url?: string | null
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_wiki"
            columns: ["qid"]
            isOneToOne: false
            referencedRelation: "wiki"
            referencedColumns: ["qid"]
          },
        ]
      }
    }
    Views: {
      async_game_activity: {
        Row: {
          active_players: number | null
          created_at: string | null
          current_round_number: number | null
          end_reason: string | null
          ended_at: string | null
          game_status: string | null
          latest_activity_at: string | null
          max_days_per_move: number | null
          participants: Json | null
          room_id: string | null
        }
        Relationships: []
      }
      prompts_latest: {
        Row: {
          country: string | null
          created_at: string | null
          date: string | null
          description: string | null
          gps_coordinates: string | null
          id: string | null
          location_name: string | null
          negative_prompt: string | null
          prompt: string | null
          title: string | null
          user_id: string | null
          year: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          gps_coordinates?: string | null
          id?: string | null
          location_name?: string | null
          negative_prompt?: string | null
          prompt?: string | null
          title?: string | null
          user_id?: string | null
          year?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          gps_coordinates?: string | null
          id?: string | null
          location_name?: string | null
          negative_prompt?: string | null
          prompt?: string | null
          title?: string | null
          user_id?: string | null
          year?: number | null
        }
        Relationships: []
      }
      prompts_public: {
        Row: {
          country: string | null
          created_at: string | null
          date: string | null
          description: string | null
          gps_coordinates: string | null
          id: string | null
          location_name: string | null
          negative_prompt: string | null
          prompt: string | null
          title: string | null
          user_id: string | null
          year: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          gps_coordinates?: string | null
          id?: string | null
          location_name?: string | null
          negative_prompt?: string | null
          prompt?: string | null
          title?: string | null
          user_id?: string | null
          year?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          gps_coordinates?: string | null
          id?: string | null
          location_name?: string | null
          negative_prompt?: string | null
          prompt?: string | null
          title?: string | null
          user_id?: string | null
          year?: number | null
        }
        Relationships: []
      }
      round_results_event_averages: {
        Row: {
          avg_distance_km: number | null
          avg_years_off: number | null
          image_id: string | null
          room_id: string | null
          total_guesses: number | null
        }
        Relationships: [
          {
            foreignKeyName: "round_results_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      apply_verification_fixes_v2: {
        Args: { p_fixes: Json; p_prompt_id: string }
        Returns: boolean
      }
      bulk_update_prompts_authenticity: {
        Args: { updates: Json }
        Returns: undefined
      }
      clamp_timer: {
        Args: { p_clamp_sec: number; p_timer_id: string; p_user_id?: string }
        Returns: {
          duration_sec: number
          end_at: string
          server_now: string
          started_at: string
          timer_id: string
        }[]
      }
      cleanup_played_images: { Args: never; Returns: undefined }
      compete_append_chat_message: {
        Args: { p_message: string; p_room_id: string; p_user_id: string }
        Returns: string
      }
      compete_lobby_event: {
        Args: { p_event_type: string; p_payload?: Json; p_room_id: string }
        Returns: undefined
      }
      compete_reset_round_state: {
        Args: { p_room_id: string }
        Returns: undefined
      }
      compete_start_round: {
        Args: {
          p_duration_sec: number
          p_room_id: string
          p_round_number: number
          p_started_at: string
        }
        Returns: {
          duration_sec: number
          started_at: string
        }[]
      }
      compete_update_match_player: {
        Args: { p_patch: Json; p_room_id: string; p_user_id: string }
        Returns: {
          active: boolean
          display_name: string | null
          inserted_at: string
          is_host: boolean
          joined_at: string
          kicked_at: string | null
          last_activity_at: string | null
          last_seen: string
          ready: boolean
          results_ready_rounds: number[]
          room_id: string
          timeout_reason: string | null
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "session_players"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      compete_upsert_match_player: {
        Args: {
          p_display_name?: string
          p_is_host?: boolean
          p_ready?: boolean
          p_room_id: string
          p_user_id: string
        }
        Returns: {
          active: boolean
          display_name: string | null
          inserted_at: string
          is_host: boolean
          joined_at: string
          kicked_at: string | null
          last_activity_at: string | null
          last_seen: string
          ready: boolean
          results_ready_rounds: number[]
          room_id: string
          timeout_reason: string | null
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "session_players"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      create_game_session_and_pick_images: {
        Args: {
          p_count: number
          p_is_async?: boolean
          p_max_days_per_move?: number
          p_max_year?: number
          p_min_year?: number
          p_room_id?: string
          p_seed?: string
          p_user_id?: string
        }
        Returns: {
          image_id: string
          order_index: number
        }[]
      }
      create_game_session_and_pick_images_v1: {
        Args: {
          p_count: number
          p_is_async?: boolean
          p_max_days_per_move?: number
          p_max_year?: number
          p_min_year?: number
          p_room_id?: string
          p_seed?: string
          p_user_id?: string
        }
        Returns: {
          image_id: string
          order_index: number
        }[]
      }
      dedupe_images: { Args: never; Returns: undefined }
      delete_prompts: { Args: { prompt_ids: string[] }; Returns: Json }
      delete_unlinked_prompts: { Args: { prompt_ids: string[] }; Returns: Json }
      ensure_game_session_images:
        | {
            Args: {
              p_count: number
              p_max_year?: number
              p_min_year?: number
              p_room_id: string
              p_seed?: string
              p_user_id?: string
            }
            Returns: string[]
          }
        | {
            Args: {
              p_count: number
              p_is_async?: boolean
              p_max_days_per_move?: number
              p_max_year?: number
              p_min_year?: number
              p_room_id: string
              p_seed?: string
              p_user_id?: string
            }
            Returns: string[]
          }
      ensure_game_session_images_v1: {
        Args: { p_game_id: string }
        Returns: boolean
      }
      ensure_session_membership: {
        Args: { p_room_id: string; p_user_id: string }
        Returns: undefined
      }
      fetch_round_state: {
        Args: { p_room_id: string; p_round_index: number }
        Returns: {
          duration_sec: number
          finalized_payload: Json
          phase: string
          started_at: string
          submitted_count: number
          submitted_player_ids: string[]
        }[]
      }
      get_collection_stats: {
        Args: never
        Returns: {
          events_with_images: number
          recent_collections: number
          themes_breakdown: Json
          total_events: number
          verified_events: number
        }[]
      }
      get_community_accuracy: {
        Args: never
        Returns: {
          location_accuracy: number
          overall_accuracy: number
          time_accuracy: number
        }[]
      }
      get_database_statistics: {
        Args: never
        Returns: {
          field_name: string
          field_type: string
          non_null_count: number
          row_count: number
          table_name: string
        }[]
      }
      get_enhanced_quick_stats: {
        Args: never
        Returns: {
          auth_users: number
          guest_users: number
          ready_images: number
          total_games: number
          total_prompts: number
          total_users: number
        }[]
      }
      get_final_scoreboard: {
        Args: { p_room_id: string }
        Returns: {
          avg_accuracy: number
          display_name: string
          net_avg_accuracy: number
          net_xp: number
          rounds_played: number
          total_acc_debt: number
          total_hints_used: number
          total_score: number
          total_xp: number
          total_xp_debt: number
          user_id: string
        }[]
      }
      get_image_play_stats: { Args: { user_id: string }; Returns: Json }
      get_images_excluding_history:
        | {
            Args: { p_limit_count: number; p_user_id: string }
            Returns: {
              "1_when_century": string | null
              "1_where_continent": string | null
              "2_when_event": string | null
              "2_when_event_years": string | null
              "2_where_landmark": string | null
              "2_where_landmark_km": number | null
              "3_when_decade": string | null
              "3_where_region": string | null
              "4_when_event": string | null
              "4_when_event_years": number | null
              "4_where_landmark": string | null
              "4_where_landmark_km": number | null
              "5_when_clues": string | null
              "5_where_clues": string | null
              accuracy_score: Json | null
              ai_generated: boolean | null
              approx_people_count: number | null
              aspect_ratio: string | null
              binary: string | null
              celebrity: boolean | null
              cfg_scale: number | null
              confidence: number | null
              content_hash: string | null
              cost: number | null
              country: string | null
              created_at: string
              date: string | null
              description: string | null
              desktop_image_url: string | null
              desktop_size_kb: number | null
              exact_date: string | null
              firebase_desktop: string | null
              firebase_desktop_kb: number | null
              firebase_mobile: string | null
              firebase_mobile_kb: number | null
              firebase_size_kb: number | null
              firebase_url: string | null
              gps_coordinates: string | null
              has_full_hints: boolean | null
              height: number | null
              hint_suggestion_first_landmark: string | null
              id: string
              image_url: string | null
              key_elements: string | null
              last_verified: string | null
              latitude: number | null
              location: string | null
              location_name: string | null
              longitude: number | null
              manually_used: boolean
              mature_content: boolean | null
              mobile_image_url: string | null
              mobile_size_kb: number | null
              model: string | null
              negative_prompt: string | null
              optimized_image_url: string | null
              original_size_kb: number | null
              output_format: string | null
              positive_prompt: string | null
              prompt: string
              prompt_id: string | null
              ready: boolean | null
              real_event: boolean | null
              scheduler: string | null
              seed: number | null
              source_citation: string | null
              steps: number | null
              theme: string | null
              thumbnail_image_url: string | null
              title: string | null
              user_id: string
              validation_issues: string | null
              width: number | null
              year: number | null
            }[]
            SetofOptions: {
              from: "*"
              to: "images"
              isOneToOne: false
              isSetofReturn: true
            }
          }
        | {
            Args: {
              p_limit_count: number
              p_max_year?: number
              p_min_year?: number
              p_user_id: string
            }
            Returns: {
              "1_when_century": string | null
              "1_where_continent": string | null
              "2_when_event": string | null
              "2_when_event_years": string | null
              "2_where_landmark": string | null
              "2_where_landmark_km": number | null
              "3_when_decade": string | null
              "3_where_region": string | null
              "4_when_event": string | null
              "4_when_event_years": number | null
              "4_where_landmark": string | null
              "4_where_landmark_km": number | null
              "5_when_clues": string | null
              "5_where_clues": string | null
              accuracy_score: Json | null
              ai_generated: boolean | null
              approx_people_count: number | null
              aspect_ratio: string | null
              binary: string | null
              celebrity: boolean | null
              cfg_scale: number | null
              confidence: number | null
              content_hash: string | null
              cost: number | null
              country: string | null
              created_at: string
              date: string | null
              description: string | null
              desktop_image_url: string | null
              desktop_size_kb: number | null
              exact_date: string | null
              firebase_desktop: string | null
              firebase_desktop_kb: number | null
              firebase_mobile: string | null
              firebase_mobile_kb: number | null
              firebase_size_kb: number | null
              firebase_url: string | null
              gps_coordinates: string | null
              has_full_hints: boolean | null
              height: number | null
              hint_suggestion_first_landmark: string | null
              id: string
              image_url: string | null
              key_elements: string | null
              last_verified: string | null
              latitude: number | null
              location: string | null
              location_name: string | null
              longitude: number | null
              manually_used: boolean
              mature_content: boolean | null
              mobile_image_url: string | null
              mobile_size_kb: number | null
              model: string | null
              negative_prompt: string | null
              optimized_image_url: string | null
              original_size_kb: number | null
              output_format: string | null
              positive_prompt: string | null
              prompt: string
              prompt_id: string | null
              ready: boolean | null
              real_event: boolean | null
              scheduler: string | null
              seed: number | null
              source_citation: string | null
              steps: number | null
              theme: string | null
              thumbnail_image_url: string | null
              title: string | null
              user_id: string
              validation_issues: string | null
              width: number | null
              year: number | null
            }[]
            SetofOptions: {
              from: "*"
              to: "images"
              isOneToOne: false
              isSetofReturn: true
            }
          }
      get_quick_stats: {
        Args: never
        Returns: {
          ready_images: number
          total_prompts: number
          total_users: number
        }[]
      }
      get_random_game_images: {
        Args: { limit_count: number }
        Returns: {
          continent: string
          country: string
          description: string
          id: string
          image_url: string
          latitude: number
          location_name: string
          longitude: number
          title: string
          year: number
        }[]
      }
      get_room_round_image: {
        Args: { p_room_id: string; p_round_index: number }
        Returns: {
          confidence: number
          description: string
          firebase_url: string
          image_id: string
          image_url: string
          latitude: number
          location_name: string
          longitude: number
          order_index: number
          source_citation: string
          title: string
          year: number
        }[]
      }
      get_round_scoreboard: {
        Args: { p_room_id: string; p_round_number: number }
        Returns: {
          acc_debt: number
          accuracy: number
          display_name: string
          distance_km: number
          guess_year: number
          score: number
          user_id: string
          xp_debt: number
          xp_total: number
        }[]
      }
      get_timer: {
        Args: { p_timer_id: string; p_user_id?: string }
        Returns: {
          out_duration_sec: number
          out_end_at: string
          out_server_now: string
          out_started_at: string
          out_timer_id: string
        }[]
      }
      get_user_timer: {
        Args: { p_timer_id: string }
        Returns: {
          duration_sec: number
          end_at: string
          server_now: string
          started_at: string
          timer_id: string
        }[]
      }
      get_verification_stats: {
        Args: never
        Returns: {
          avg_metadata_accuracy: number
          failed_count: number
          hints_validation_rate: number
          manual_review_count: number
          pending_count: number
          total_prompts: number
          verified_count: number
          year_location_success_rate: number
        }[]
      }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
      is_room_host:
        | { Args: { p_room_id: string; p_user_id: string }; Returns: boolean }
        | {
            Args: { room: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.is_room_host(room => text), public.is_room_host(room => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { room: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.is_room_host(room => text), public.is_room_host(room => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      is_room_participant:
        | { Args: { p_room_id: string; p_user_id: string }; Returns: boolean }
        | {
            Args: { room: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.is_room_participant(room => text), public.is_room_participant(room => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { room: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.is_room_participant(room => text), public.is_room_participant(room => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      merge_duplicates_images: {
        Args: { dups: string[]; keep: string }
        Returns: undefined
      }
      merge_duplicates_prompts: {
        Args: { dups: string[]; keep: string }
        Returns: undefined
      }
      parse_gps_coordinates: {
        Args: { gps_text: string }
        Returns: {
          lat: number
          lng: number
        }[]
      }
      persist_round_start:
        | {
            Args: {
              p_duration_sec: number
              p_room_id: string
              p_round_number: number
              p_started_at: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_room_id: string
              p_round_number: number
              p_started_at: string
            }
            Returns: undefined
          }
      process_async_deadlines: { Args: never; Returns: Json }
      purchase_hint: {
        Args: {
          p_accuracy_penalty: number
          p_hint_id: string
          p_round_id: string
          p_user_id: string
          p_xp_cost: number
        }
        Returns: undefined
      }
      reset_session_players_ready: {
        Args: { p_room_id: string }
        Returns: undefined
      }
      resolve_badge_ids: {
        Args: { slug_list: string[] }
        Returns: {
          id: string
          name_slug: string
        }[]
      }
      room_participant_has_access:
        | {
            Args: { room: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.room_participant_has_access(room => text), public.room_participant_has_access(room => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { room: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.room_participant_has_access(room => text), public.room_participant_has_access(room => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      server_persist_round_score: {
        Args: {
          _acc_debt: number
          _display_name: string
          _distance_km: number
          _guess_lat: number
          _guess_lng: number
          _guess_year: number
          _hints_used: number
          _location_accuracy: number
          _room_id: string
          _round_number: number
          _time_accuracy: number
          _user_id: string
          _xp_debt: number
          _xp_total: number
          _year_difference: number
        }
        Returns: undefined
      }
      set_prompt_verification: {
        Args: {
          p_confidence: number
          p_explanation: string
          p_fingerprint: string
          p_id: string
          p_models: string[]
          p_source_citation: string
          p_sources: string[]
          p_verdict: string
          p_verification_citations: Json
          p_verified_by: string
        }
        Returns: undefined
      }
      set_prompt_verification_v2: {
        Args: {
          p_hints_validated: boolean
          p_id: string
          p_location_strict_ok: boolean
          p_metadata_accuracy_score: number
          p_verification_failures: Json
          p_verification_status: string
          p_verified_lat: number
          p_verified_location_name: string
          p_verified_lon: number
          p_verified_year: number
          p_year_strict_ok: boolean
        }
        Returns: undefined
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      sp_set_results_ready_round: {
        Args: {
          _ready: boolean
          _room_id: string
          _round_number: number
          _user_id: string
        }
        Returns: undefined
      }
      sp_set_session_player_active: {
        Args: { p_active: boolean; p_room_id: string; p_user_id: string }
        Returns: undefined
      }
      start_timer: {
        Args: { p_duration_sec: number; p_timer_id: string; p_user_id?: string }
        Returns: {
          out_duration_sec: number
          out_end_at: string
          out_server_now: string
          out_started_at: string
          out_timer_id: string
        }[]
      }
      start_user_timer: {
        Args: { p_duration_sec: number; p_timer_id: string }
        Returns: {
          duration_sec: number
          end_at: string
          server_now: string
          started_at: string
          timer_id: string
        }[]
      }
      upsert_user_settings: {
        Args: { p_settings: Json; p_user_id: string }
        Returns: undefined
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
