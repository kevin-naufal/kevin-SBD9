// server.js

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import pg from 'pg';
import userRoutes from './routes/users.js';
import emailRoutes from './routes/emails.js'; // Import the email routes

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL pool setup
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Database connection check
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client:', err.stack);
    return;
  }
  console.log('Connected to the database');
  release();
});

// Routes
app.use('/api/users', (req, res, next) => {
  req.pool = pool; // Provide pool to routes
  next();
}, userRoutes);

app.use('/api/emails', (req, res, next) => {
  req.pool = pool; // Provide pool to routes
  next();
}, emailRoutes); // Add email routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
