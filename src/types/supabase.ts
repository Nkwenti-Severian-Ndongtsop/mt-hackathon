export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          target_amount: number;
          current_amount: number;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
      };
      subscription_plans: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          features: string[];
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          price: number;
          features?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          features?: string[];
          created_at?: string;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          subscription_plans: {
            name: string;
          };
          status: string;
          end_date: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          role: 'user' | 'admin';
          full_name: string;
        };
      };
    };
  };
}; 