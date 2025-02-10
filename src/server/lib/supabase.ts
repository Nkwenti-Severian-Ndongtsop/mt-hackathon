import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the server's .env file
config({ path: join(dirname(__dirname), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Missing Supabase environment variables:
    SUPABASE_URL: ${supabaseUrl ? 'set' : 'missing'}
    SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'set' : 'missing'}
  `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 