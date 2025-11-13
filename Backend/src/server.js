// ✅ Import core packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// ✅ Load environment variables from .env file
dotenv.config();

// ✅ Log Clerk keys to verify they're loaded (remove after testing)
console.log('CLERK_PUBLISHABLE_KEY:', process.env.CLERK_PUBLISHABLE_KEY);
console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY);

// ✅ Import Clerk middleware for backend authentication
const { clerkMiddleware } = require('@clerk/express');

// ✅ Import route modules
const userRoutes = require('../routes/userRoutes');
const doctorRoutes = require('../routes/doctorRoutes');
const appointmentRoutes = require('../routes/appointmentRoutes');

// ✅ Initialize Express app
const app = express();

// ✅ Parse incoming JSON requests
app.use(express.json());

// ✅ Enable CORS for frontend access
app.use(cors({
  origin: 'http://localhost:5173', // Vite default dev server
  credentials: true
}));

// ✅ Inject Clerk authentication into every request
app.use(clerkMiddleware());

// ✅ Define the port to run the server on
const PORT = process.env.PORT || 5000;

// ✅ Root route for testing the server
app.get('/', (req, res) => {
  res.send('🚀 Root Server running...');
});

// ✅ Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

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
