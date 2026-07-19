export const makeEventRepository = ({ rawQuery }) => ({
  create: async ({
    title, description, eventDate, location,
    eventType, price, quota, organizerId,
    status = 'PUBLISHED', source = 'MANUAL', externalId = null,
  }) => {
    const result = await rawQuery(
      `INSERT INTO events (
        title, description, event_date, location,
        event_type, price, quota, organizer_id,
        status, source, external_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [title, description, eventDate, location, eventType, price, quota, organizerId, status, source, externalId],
    );
    return result.rows[0];
  },

  findAll: async ({ status = 'PUBLISHED' } = {}) => {
    const result = await rawQuery('SELECT * FROM events WHERE status = $1 ORDER BY event_date ASC', [status]);
    return result.rows;
  },

  findById: async (id) => {
    const result = await rawQuery('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },

  findByExternalId: async ({ externalId, source }) => {
    const result = await rawQuery('SELECT id FROM events WHERE external_id = $1 AND source = $2', [externalId, source]);
    return result.rows[0] ?? null;
  },

  updateStatus: async (id, status) => {
    const result = await rawQuery('UPDATE events SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    return result.rows[0] ?? null;
  },

  editAndPublish: async (id, { title, description, eventDate, location, eventType, price, quota }) => {
    const result = await rawQuery(
      `UPDATE events
       SET title = $1, description = $2, event_date = $3, location = $4,
           event_type = $5, price = $6, quota = $7, status = 'PUBLISHED'
       WHERE id = $8
       RETURNING *`,
      [title, description, eventDate, location, eventType, price, quota, id],
    );
    return result.rows[0] ?? null;
  },
});
