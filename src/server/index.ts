import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import stripeRoutes from './api/routes/stripe.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the server's .env file
config({ path: join(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 5001;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

app.use(express.json());

// Routes
app.use('/api', stripeRoutes);

// Debug route
app.get('/api/debug/env', (_req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL ? 'set' : 'missing',
    supabaseKey: process.env.SUPABASE_ANON_KEY ? 'set' : 'missing',
    stripeKey: process.env.STRIPE_SECRET_KEY ? 'set' : 'missing',
    frontendUrl: process.env.FRONTEND_URL
  });
});

interface ServerError extends Error {
  code?: string;
}

const startServer = async (port: number) => {
  try {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error: unknown) {
    if ((error as ServerError).code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}`);
      await startServer(port + 1);
    } else {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
};

process.on('uncaughtException', (error: ServerError) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
    startServer(PORT + 1);
  } else {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  }
});

startServer(PORT); 