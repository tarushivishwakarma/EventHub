const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const eventRoutes = require('./routes/eventRoutes');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authMiddleware = require('./middleware/auth');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(logger); 

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventRegistrationDB';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail faster if unable to connect
    });
    isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('MongoDB connection error:', err);
  }
};

// Middleware to ensure DB is connected before handling any API routes
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', authMiddleware, eventRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running successfully');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Functions
module.exports = app;
