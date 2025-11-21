// Backend/src/server.js

// ✅ Import core packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// ✅ Load environment variables
dotenv.config();

// ✅ Clerk middleware
const { clerkMiddleware } = require('@clerk/express');

// ✅ Import route modules
const usersRouter = require('../routes/usersRoutes');
const patientRoutes = require('../routes/patientRoutes');
const doctorRoutes = require('../routes/doctorRoutes');
const appointmentRoutes = require('../routes/appointmentRoutes');

// ✅ Initialize Express app
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: true, // adjust for your frontend
  credentials: true
}));
app.use(clerkMiddleware());

// ✅ Port
const PORT = process.env.PORT || 5000;

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🚀 Root Server running...');
});

// ✅ Mount API routes (Option A consistency: all under /api)
app.use('/api/users', usersRouter);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// ✅ Connect to MongoDB and start server
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
