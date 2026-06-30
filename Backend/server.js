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

app.use(cors());
app.use(express.json());
app.use(logger); 

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventRegistrationDB';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', authMiddleware, eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
