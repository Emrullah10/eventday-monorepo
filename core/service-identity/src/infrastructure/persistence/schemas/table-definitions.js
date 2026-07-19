/**
 * JS source-of-truth for the `users` table. Mirrors db-schemas/01-identity-schema.sql —
 * scripts/build-schema.js currently generates the SQL from the numbered .sql
 * files directly, but this definition is kept as the canonical column list
 * for repositories in this service to reference.
 */
export const usersTable = {
  name: 'users',
  columns: {
    id: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    password_hash: 'VARCHAR(255) NOT NULL',
    full_name: 'VARCHAR(255) NOT NULL',
    role: "VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('USER', 'ORGANIZER', 'ADMIN'))",
    created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP',
  },
};
