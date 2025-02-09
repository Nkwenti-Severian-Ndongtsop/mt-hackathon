import React from 'react';
import { DashboardStats as DashboardStatsType } from '../types';
import { Users, FolderGit, DollarSign } from 'lucide-react';

interface StatsProps {
  stats: DashboardStatsType;
}

export function DashboardStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-gray-500">Active Users</p>
            <p className="text-2xl font-semibold">{stats.activeUsers}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-3 rounded-lg">
            <FolderGit className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500">Total Projects</p>
            <p className="text-2xl font-semibold">{stats.totalProjects}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-3 rounded-lg">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500">Total Funding</p>
            <p className="text-2xl font-semibold">${stats.totalFunding}</p>
          </div>
        </div>
      </div>
    </div>
  );
}