import express from 'express';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

// Create a Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { planId, userId, userEmail } = req.body;

    // Get plan details from Supabase
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (!plan) {
      throw new Error('Plan not found');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'xaf',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/subscription-plans?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription-plans`,
      customer_email: userEmail,
      metadata: {
        userId,
        planId,
      },
    });

    res.json({ id: session.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment status
router.post('/verify-payment', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      res.json({ success: true, session });
    } else {
      res.json({ success: false });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 