import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { FileText, DollarSign, Calendar, Loader } from 'lucide-react';

export default function ProjectSubmissionForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check subscription and project limits
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*, plan:plan_id(*)')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      if (!subscription) {
        toast.error('Active subscription required to submit projects');
        return;
      }

      // Check project count
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id);

      const projectLimit = subscription.plan.name === 'Basic' ? 2 : 
                         subscription.plan.name === 'Pro' ? 5 : 
                         Infinity;

      if (count && count >= projectLimit) {
        toast.error(`Project limit reached for ${subscription.plan.name} plan`);
        return;
      }

      // Submit project
      const { error } = await supabase.from('projects').insert({
        user_id: user?.id,
        title,
        description,
        target_amount: parseFloat(targetAmount),
        duration_months: parseInt(duration),
        status: 'pending'
      });

      if (error) throw error;
      toast.success('Project submitted for review');
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTargetAmount('');
    setDuration('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-indigo-100 rounded-full p-3">
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Submit Your Project
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Share your project details with potential investors
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your project in detail"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline-block w-4 h-4 mr-1" />
                  Target Amount
                </label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter amount"
                  min="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Duration (months)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Project duration"
                  min="1"
                  max="60"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Submitting...
                </>
              ) : (
                'Submit Project'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 