import React from 'react';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = (project.currentFunding / project.fundingGoal) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          project.status === 'approved' ? 'bg-green-100 text-green-800' :
          project.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 rounded-full h-2"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>Current: ${project.currentFunding}</span>
          <span>Goal: ${project.fundingGoal}</span>
        </div>
      </div>
      <button className="mt-4 w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
        <span>View Details</span>
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}