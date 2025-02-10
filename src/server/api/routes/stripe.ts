import express, { RequestHandler } from 'express';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase.js';

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia'  // Update to match required version
});

// Create a Stripe checkout session
router.post('/create-checkout-session', (async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { planId, userId, userEmail } = req.body;

    if (!planId || !userId || !userEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { planId, userId, userEmail }
      });
    }

    // Get plan details from Supabase
    const { data: plan, error: supabaseError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return res.status(500).json({ error: 'Database error', details: supabaseError.message });
    }

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    console.log('Found plan:', plan);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'xaf',
            product_data: {
              name: plan.name,
              description: plan.description || undefined,
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
    console.error('Stripe error:', error);
    res.status(500).json({ 
      error: error.message,
      type: error.type,
      code: error.code
    });
  }
}) as RequestHandler);

// Verify payment status
router.post('/verify-payment', (async (req, res) => {
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
}) as RequestHandler);

export default router; 