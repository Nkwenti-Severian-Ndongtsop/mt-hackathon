import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  duration_months: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles: {
    full_name: string;
  };
}

export default function AdminDashboard() {
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFunding, setTotalFunding] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'projects' },
        (payload) => {
          handleNewProject(payload.new);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects with proper join and all required fields
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      
      setPendingProjects(projects || []);

      // Fetch other statistics
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      if (userError) throw userError;
      setTotalUsers(userCount || 0);

      const { data: funding, error: fundingError } = await supabase
        .from('project_funding')
        .select('amount')
        .eq('status', 'completed');
      
      if (fundingError) throw fundingError;
      setTotalFunding(
        funding?.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0
      );

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
      setLoading(false);
    }
  };

  const handleNewProject = (project: any) => {
    setPendingProjects(prev => [project as Project, ...prev]);
    toast.success('New project submission received!');
  };

  const handleProjectAction = async (projectId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', projectId);

      if (error) throw error;

      setPendingProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success(`Project ${status} successfully`);
    } catch (error) {
      toast.error('Error updating project status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Funding</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${totalFunding.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending Projects</h2>
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Pending
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {project.target_amount?.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.duration_months} months
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <button
                      onClick={() => handleProjectAction(project.id, 'approved')}
                      className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleProjectAction(project.id, 'rejected')}
                      className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        
        {pendingProjects.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-12">
            No pending projects to review
          </div>
        )}
      </div>
    </div>
  );
} 