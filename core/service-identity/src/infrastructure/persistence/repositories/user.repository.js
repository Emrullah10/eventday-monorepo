export const makeUserRepository = ({ rawQuery }) => ({
  findByEmail: async (email) => {
    const result = await rawQuery('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ?? null;
  },

  findById: async (id) => {
    const result = await rawQuery(
      'SELECT id, email, full_name, role FROM users WHERE id = $1',
      [id],
    );
    return result.rows[0] ?? null;
  },

  create: async ({ email, passwordHash, fullName }) => {
    const result = await rawQuery(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, role`,
      [email, passwordHash, fullName],
    );
    return result.rows[0];
  },
});
