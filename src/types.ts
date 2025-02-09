export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  fundingGoal: number;
  currentFunding: number;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalFunding: number;
  activeUsers: number;
}