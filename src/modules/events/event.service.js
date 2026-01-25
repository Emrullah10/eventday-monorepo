const db = require('../../common/database');

class EventService {
  async createEvent(data) {
    const {
      title, description, eventDate, location,
      eventType, price, quota, organizerId,
      status = 'PUBLISHED', source = 'MANUAL', externalId = null
    } = data;

    const query = `
      INSERT INTO events (
        title, description, event_date, location,
        event_type, price, quota, organizer_id,
        status, source, external_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      title, description, eventDate, location,
      eventType, price, quota, organizerId,
      status, source, externalId
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  async getAllEvents(filters = {}) {
    const { status = 'PUBLISHED' } = filters;
    const result = await db.query('SELECT * FROM events WHERE status = $1 ORDER BY event_date ASC', [status]);
    return result.rows;
  }

  async getEventById(id) {
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = new EventService();
