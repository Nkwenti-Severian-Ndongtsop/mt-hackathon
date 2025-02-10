import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import FundProject from './pages/projects/FundProject';
import About from "./components/layout/About";
import SubscriptionPlans from './pages/subscription/SubscriptionPlans';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import ProjectSubmissionFormComponent from './components/ProjectSubmissionForm';
import { useNavigate } from 'react-router-dom';
import AdminLogin from './pages/admin/AdminLogin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

// Protected Route component
function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();

    const isAdminUser = data?.role === 'admin';
    setIsAdmin(isAdminUser);

    if (adminOnly && isAdminUser && !sessionStorage.getItem('adminAuthenticated')) {
      navigate('/admin/login');
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  if (adminOnly && !sessionStorage.getItem('adminAuthenticated')) return <Navigate to="/admin/login" />;
  return children;
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/fund-project" element={
              <ProtectedRoute>
                <FundProject />
              </ProtectedRoute>
            } />
            <Route path="/subscription-plans" element={
              <ProtectedRoute>
             <SubscriptionPlans />
              </ProtectedRoute>
             } />
            <Route path="/submit-project" element={
              <ProtectedRoute>
                <ProjectSubmissionFormComponent />
              </ProtectedRoute>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
