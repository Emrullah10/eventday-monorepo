const BookingService = require('./booking.service');

class BookingController {
  async book(req, res) {
    try {
      const { eventId } = req.body;
      const userId = req.user?.id || req.body.userId; // auth middleware logic simplified

      if (!eventId || !userId) {
        return res.status(400).json({ message: 'User ID and Event ID are required' });
      }

      const ticket = await BookingService.createBooking({ userId, eventId });
      res.status(201).json({
        message: 'Ticket booked successfully',
        ticket
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async myTickets(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;
      const tickets = await BookingService.getUserTickets(userId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new BookingController();
