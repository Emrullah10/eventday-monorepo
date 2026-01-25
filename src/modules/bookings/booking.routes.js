const express = require('express');
const router = express.Router();
const BookingController = require('./booking.controller');
const authMiddleware = require('../../common/middlewares/auth');

// Book a ticket (Protected)
router.post('/', authMiddleware, BookingController.book);

// Get user tickets (Protected)
router.get('/my/:userId', authMiddleware, BookingController.myTickets);

module.exports = router;
