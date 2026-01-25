const db = require('../../common/database');

class BookingService {
  async createBooking({ userId, eventId }) {
    // 1. Check event exists and get quota
    const eventRes = await db.query('SELECT id, quota FROM events WHERE id = $1', [eventId]);
    const event = eventRes.rows[0];
    if (!event) throw new Error('Event not found');

    // 2. Check current bookings count
    const countRes = await db.query('SELECT COUNT(*) FROM tickets WHERE event_id = $1 AND status = $2', [eventId, 'CONFIRMED']);
    const currentCount = parseInt(countRes.rows[0].count);

    if (currentCount >= event.quota) {
      throw new Error('Event is full');
    }

    // 3. Check if user already has a ticket
    const existingTicket = await db.query('SELECT id FROM tickets WHERE user_id = $1 AND event_id = $2', [userId, eventId]);
    if (existingTicket.rows.length > 0) {
      throw new Error('You already have a ticket for this event');
    }

    // 4. Create ticket
    const query = `
      INSERT INTO tickets (user_id, event_id, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const res = await db.query(query, [userId, eventId, 'CONFIRMED']);
    return res.rows[0];
  }

  async getUserTickets(userId) {
    const query = `
      SELECT t.*, e.title, e.event_date, e.location
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      WHERE t.user_id = $1
      ORDER BY e.event_date ASC
    `;
    const res = await db.query(query, [userId]);
    return res.rows;
  }
}

module.exports = new BookingService();
