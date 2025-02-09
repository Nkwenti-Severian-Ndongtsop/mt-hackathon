import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { DashboardStats } from './components/DashboardStats';
import { Project, DashboardStats as DashboardStatsType } from './types';

// Mock data
const mockUser = { name: 'John Doe', email: 'john@example.com', role: 'user' };

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Health Monitor',
    description: 'A wearable device that uses AI to monitor vital signs and predict potential health issues.',
    userId: '1',
    status: 'approved',
    fundingGoal: 50000,
    currentFunding: 35000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Sustainable Energy Hub',
    description: 'A platform connecting renewable energy providers with consumers for efficient resource distribution.',
    userId: '2',
    status: 'pending',
    fundingGoal: 75000,
    currentFunding: 25000,
    createdAt: new Date().toISOString(),
  },
];

const mockStats: DashboardStatsType = {
  totalProjects: 156,
  totalFunding: 2500000,
  activeUsers: 1234,
};

function App() {
  const [user] = useState(mockUser);

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <DashboardStats stats={mockStats} />
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Active Projects</h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Submit Project
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;