const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const userRoutes = require('./modules/user/user.routes');
const eventRoutes = require('./modules/events/event.routes');
const bookingRoutes = require('./modules/bookings/booking.routes');
const aggregatorRoutes = require('./modules/aggregator/aggregator.routes');
const adminRoutes = require('./modules/admin/admin.routes');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/aggregator', aggregatorRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Event Day API is running' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

module.exports = app;
