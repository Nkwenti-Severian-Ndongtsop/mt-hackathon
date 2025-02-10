import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import html2pdf from 'html2pdf.js';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { SubscriptionPlan } from '../../types';
import { api } from '../../lib/api';

// Initialize Stripe
const STRIPE_PUBLIC_KEY = `${import.meta.env.VITE_STRIPE_PUBLIC_KEY}`;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

console.log('Stripe key loaded:', STRIPE_PUBLIC_KEY ? 'Yes' : 'No');

const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 5000, // 5,000 XAF
    description: 'Perfect for getting started',
    features: [
      'Submit up to 2 projects',
      'Basic project analytics',
      'Email support',
      'Access to basic resources'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 15000, // 15,000 XAF
    description: 'Ideal for growing projects',
    features: [
      'Submit up to 5 projects',
      'Advanced project analytics',
      'Priority email support',
      'Access to pro resources',
      'Monthly strategy call'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 50000, // 50,000 XAF
    description: 'For large scale operations',
    features: [
      'Unlimited project submissions',
      'Custom analytics dashboard',
      '24/7 phone support',
      'Access to all resources',
      'Weekly strategy calls',
      'Custom integration support'
    ]
  }
];

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const generateReceipt = async (subscriptionData: any) => {
    const receipt = document.createElement('div');
    receipt.innerHTML = `
      <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1 style="text-align: center; color: #4F46E5;">Mountains Tech Receipt</h1>
        <hr style="margin: 20px 0;" />
        <div style="margin-bottom: 20px;">
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Receipt No:</strong> ${subscriptionData.id}</p>
          <p><strong>Customer:</strong> ${user?.email}</p>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="color: #4F46E5;">Subscription Details</h2>
          <p><strong>Plan:</strong> ${subscriptionData.plan.name}</p>
          <p><strong>Amount:</strong> ${subscriptionData.plan.price.toLocaleString()} XAF</p>
          <p><strong>Status:</strong> Paid</p>
          <p><strong>Valid Until:</strong> ${new Date(subscriptionData.end_date).toLocaleDateString()}</p>
        </div>
        <div style="text-align: center; margin-top: 40px; color: #6B7280;">
          <p>Thank you for choosing Mountains Tech!</p>
          <p>For support, contact: support@mountainstech.com</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 1,
      filename: 'subscription_receipt.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    await html2pdf().from(receipt).set(opt).save();
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setProcessing(true);
      setSelectedPlan(plan);

      // Check if Stripe is initialized
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to initialize. Please check your public key.');
      }

      const response = await api.createCheckoutSession({
        planId: plan.id,
        userId: user.id,
        userEmail: user.email,
      });

      console.log('Checkout session response:', response);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.id) {
        throw new Error('No session ID received from server');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.id
      });

      if (error) {
        throw error;
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Error processing payment');
    } finally {
      setProcessing(false);
    }
  };

  // Handle successful payment return from Stripe
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    
    if (sessionId) {
      // Verify payment
      api.verifyPayment({ sessionId })
        .then((response) => {
          if (response.success) {
            toast.success('Payment successful!');
            if (response.receiptUrl) {
              window.open(response.receiptUrl, '_blank');
            }
          } else {
            toast.error('Payment verification failed');
          }
        })
        .catch((error) => {
          console.error('Payment verification error:', error);
          toast.error('Error verifying payment');
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Select the perfect plan for your project needs
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-base font-medium text-gray-500"> XAF/month</span>
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processing}
                  className="mt-8 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {processing ? (
                    <Loader className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 