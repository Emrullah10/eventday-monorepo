const db = require('../../common/database');

class AdminService {
  async getPendingEvents() {
    const result = await db.query('SELECT * FROM events WHERE status = $1 ORDER BY created_at DESC', ['DRAFT']);
    return result.rows;
  }

  async updateEventStatus(eventId, status) {
    const result = await db.query(
      'UPDATE events SET status = $1 WHERE id = $2 RETURNING *',
      [status, eventId]
    );
    return result.rows[0];
  }

  async editAndApproveEvent(eventId, data) {
    const { title, description, eventDate, location, eventType, price, quota } = data;
    const query = `
      UPDATE events
      SET title = $1, description = $2, event_date = $3, location = $4,
          event_type = $5, price = $6, quota = $7, status = 'PUBLISHED'
      WHERE id = $8
      RETURNING *
    `;
    const values = [title, description, eventDate, location, eventType, price, quota, eventId];
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = new AdminService();
