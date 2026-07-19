/** JS source-of-truth for the `tickets` table. Mirrors db-schemas/03-booking-schema.sql. */
export const ticketsTable = {
  name: 'tickets',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
    user_id: 'UUID REFERENCES users(id)',
    event_id: 'UUID REFERENCES events(id)',
    status: "VARCHAR(50) DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELLED', 'USED'))",
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP',
  },
  constraints: ['UNIQUE(user_id, event_id)'],
};
