import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface EmailParams {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async ({ to, subject, text }: EmailParams) => {
  // TODO: Replace with your email service (SendGrid, AWS SES, etc.)
  console.log('Email sent:', { to, subject, text });
  return true;
};