export const makeBookingRepository = ({ rawQuery, withTransaction }) => ({
  /**
   * Locks the event row (`FOR UPDATE`) so concurrent bookings for the same
   * event serialize on the quota check instead of racing — the original
   * monolith ran these as separate non-transactional queries, which allowed
   * more tickets than quota to be sold under concurrent requests.
   */
  createTicket: async ({ userId, eventId }) => {
    return withTransaction(async ({ query }) => {
      const eventRes = await query('SELECT id, quota FROM events WHERE id = $1 FOR UPDATE', [eventId]);
      const event = eventRes.rows[0];
      if (!event) return { error: 'EVENT_NOT_FOUND' };

      const countRes = await query(
        'SELECT COUNT(*) FROM tickets WHERE event_id = $1 AND status = $2',
        [eventId, 'CONFIRMED'],
      );
      const currentCount = parseInt(countRes.rows[0].count, 10);
      if (currentCount >= event.quota) return { error: 'EVENT_FULL' };

      const existingRes = await query('SELECT id FROM tickets WHERE user_id = $1 AND event_id = $2', [userId, eventId]);
      if (existingRes.rows.length > 0) return { error: 'DUPLICATE_TICKET' };

      const insertRes = await query(
        'INSERT INTO tickets (user_id, event_id, status) VALUES ($1, $2, $3) RETURNING *',
        [userId, eventId, 'CONFIRMED'],
      );
      return { ticket: insertRes.rows[0] };
    });
  },

  findUserTickets: async (userId) => {
    const result = await rawQuery(
      `SELECT t.*, e.title, e.event_date, e.location
       FROM tickets t
       JOIN events e ON t.event_id = e.id
       WHERE t.user_id = $1
       ORDER BY e.event_date ASC`,
      [userId],
    );
    return result.rows;
  },
});
