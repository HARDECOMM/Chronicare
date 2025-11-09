// Import core packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const doctorRoutes = require('../routes/doctorRoutes')
dotenv.config();

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// ✅ Middleware to parse incoming JSON requests
// This is CRITICAL for reading req.body in POST/PUT requests
app.use(express.json());

// use core middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default
  credentials: true
}));

// Define the port to run the server on
const PORT = process.env.PORT || 5000;

// ✅ Root route for testing the server
app.get('/', (req, res) => {
  res.send('🚀 Root Server running.............');
});

// ✅ Mount authentication routes under /api/auth
// Example: POST /api/auth/register
app.use('/api/doctors', doctorRoutes);

// ✅ Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });