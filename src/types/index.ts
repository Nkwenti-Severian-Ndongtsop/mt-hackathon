export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  subscription_status?: 'active' | 'inactive';
  subscription_type?: 'basic' | 'premium' | 'enterprise';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'funded';
  user_id: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  duration: 'monthly' | 'yearly';
}