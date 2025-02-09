import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Users, DollarSign, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFunding, setTotalFunding] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    checkAdminStatus();
    fetchDashboardData();
  }, [user, navigate]);

  const checkAdminStatus = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();

    if (error || data?.role !== 'admin') {
      navigate('/dashboard');
    }
  };

  const fetchDashboardData = async () => {
    // Fetch pending projects
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'pending');
    
    setPendingProjects(projects || []);

    // Fetch total users
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });
    
    setTotalUsers(count || 0);

    // Fetch total funding
    const { data: funding } = await supabase
      .from('project_funding')
      .select('amount')
      .eq('status', 'completed');
    
    setTotalFunding(
      funding?.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0
    );
  };

  const handleApproveProject = async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'approved' })
      .eq('id', projectId);

    if (!error) {
      setPendingProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Project approved successfully');
    }
  };

  const handleRejectProject = async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'rejected' })
      .eq('id', projectId);

    if (!error) {
      setPendingProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Project rejected');
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Funding ($)',
        data: [12000, 19000, 15000, 25000, 22000, totalFunding],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Pending Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Pending Projects</h2>
              <ClipboardList className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{pendingProjects.length}</p>
          </motion.div>

          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Total Users</h2>
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
          </motion.div>

          {/* Total Funding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Total Funding</h2>
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${totalFunding.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Funding Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Funding Overview</h2>
            <Activity className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="h-64">
            <Line data={chartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'Monthly Funding Overview'
                }
              }
            }} />
          </div>
        </motion.div>

        {/* Pending Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-6">Pending Projects</h2>
          <div className="space-y-4">
            {pendingProjects.map(project => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Target Amount: ${project.target_amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleApproveProject(project.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectProject(project.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingProjects.length === 0 && (
              <p className="text-center text-gray-500">No pending projects</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}