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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          user_id: string
          status: 'pending' | 'approved' | 'rejected'
          funding_goal: number
          current_funding: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          user_id: string
          status?: 'pending' | 'approved' | 'rejected'
          funding_goal: number
          current_funding?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          user_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          funding_goal?: number
          current_funding?: number
          created_at?: string
          updated_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          project_id: string
          user_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
      }
    }
  }
}