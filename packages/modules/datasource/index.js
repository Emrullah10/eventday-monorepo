import pg from 'pg';

const { Pool } = pg;

/**
 * Creates a Postgres connection pool plus a `rawQuery` / `withTransaction`
 * pair. Each service owns its own pool instance — nothing here is a
 * process-wide singleton, so tests can create isolated pools (or none at all,
 * when they inject a fake `rawQuery`).
 */
export const makeDatasource = ({ connectionString }) => {
  const pool = new Pool({ connectionString });

  const rawQuery = (text, params) => pool.query(text, params);

  /**
   * Runs `fn` with a client bound to a single transaction, committing on
   * success and rolling back on any thrown error. `fn` receives a `query`
   * function scoped to that client.
   */
  const withTransaction = async (fn) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn({ query: (text, params) => client.query(text, params) });
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  };

  return { pool, rawQuery, withTransaction };
};
