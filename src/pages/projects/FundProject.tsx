import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Project } from '../../types';
import toast from 'react-hot-toast';

export default function FundProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchApprovedProjects();
  }, []);

  const fetchApprovedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'approved');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast.error('Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async (projectId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const amount = selectedAmount[projectId];
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const { error } = await supabase.from('project_funding').insert([
        {
          project_id: projectId,
          funder_id: user.id,
          amount: amount,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      // Here you would typically integrate with a payment provider
      // For now, we'll just show a success message
      toast.success('Funding successful!');
      
      // Reset the amount
      setSelectedAmount(prev => ({ ...prev, [projectId]: 0 }));
      
      // Refresh the projects list
      fetchApprovedProjects();
    } catch (error) {
      toast.error('Error processing funding');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fund a Project</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Target Amount</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${project.target_amount.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Current Progress</p>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                        <div
                          style={{ width: `${(project.current_amount / project.target_amount) * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                        ></div>
                      </div>
                      <p className="text-right text-sm font-semibold text-indigo-600">
                        {((project.current_amount / project.target_amount) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`amount-${project.id}`} className="block text-sm font-medium text-gray-700">
                      Amount to Fund ($)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id={`amount-${project.id}`}
                        value={selectedAmount[project.id] || ''}
                        onChange={(e) => setSelectedAmount(prev => ({
                          ...prev,
                          [project.id]: parseFloat(e.target.value)
                        }))}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleFund(project.id)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Fund Project
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No approved projects available for funding at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}