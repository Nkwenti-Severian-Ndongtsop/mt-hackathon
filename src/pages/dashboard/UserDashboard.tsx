import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, FileText, PlusCircle, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { SubscriptionPlan, Project } from '../../types';
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

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchSubscriptionPlans();
    fetchUserProjects();
    fetchSubscription();
  }, [user, navigate]);

  const fetchSubscriptionPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*');
    
    if (error) {
      console.error('Error fetching subscription plans:', error);
      return;
    }

    setSubscriptionPlans(data);
  };

  const fetchUserProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user?.id);
    
    if (error) {
      console.error('Error fetching user projects:', error);
      return;
    }

    setUserProjects(data);
  };

  const fetchSubscription = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:plan_id (
            name,
            price,
            description
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      console.log('Fetched subscription:', data);
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: userProjects.map(project => project.title),
    datasets: [
      {
        label: 'Funding Progress',
        data: userProjects.map(project => (project.current_amount / project.target_amount) * 100),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }
    ]
  };

  const handleUpgrade = () => {
    navigate('/subscription-plans');
  };

  const SubscriptionCard = ({ subscription, onUpgrade }: { 
    subscription: any; 
    onUpgrade: () => void;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Subscription Status</h2>
          <CreditCard className="h-6 w-6 text-indigo-600" />
        </div>
        {subscription ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900">
                {subscription.plan.name}
              </span>
              <span className="px-2 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <p>Valid until: {new Date(subscription.end_date).toLocaleDateString()}</p>
              <p className="mt-1">
                {Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
              </p>
            </div>
            <button
              onClick={onUpgrade}
              className="mt-4 w-full px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">No active subscription</p>
            <button
              onClick={onUpgrade}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Subscription Status */}
          <SubscriptionCard 
            subscription={subscription} 
            onUpgrade={handleUpgrade}
          />

          {/* Project Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Project Stats</h2>
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Total Projects: {userProjects.length}</p>
              <p className="text-sm text-gray-500">
                Approved: {userProjects.filter(p => p.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-500">
                Pending: {userProjects.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <PlusCircle className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/submit-project')}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Submit New Project
              </button>
              <button
                onClick={() => navigate('/subscription-plans')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Upgrade Subscription
              </button>
            </div>
          </motion.div>
        </div>

        {/* Project Funding Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Project Funding Progress</h2>
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
                  text: 'Project Funding Progress (%)'
                }
              }
            }} />
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-6">Recent Projects</h2>
          <div className="space-y-4">
            {userProjects.map(project => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'approved' ? 'bg-green-100 text-green-800' :
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-indigo-600">
                          Funding Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-indigo-600">
                          {((project.current_amount / project.target_amount) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                      <div
                        style={{ width: `${(project.current_amount / project.target_amount) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}