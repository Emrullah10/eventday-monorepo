const db = require('../../common/database');
const bcrypt = require('bcryptjs');

/**
 * UserService - Handles Domain Logic for Users
 * DDD: This is a Domain Service
 */
class UserService {
  async register({ email, password, fullName }) {
    // 1. Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('Email already registered');
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Save to database
    const query = `
      INSERT INTO users (email, password_hash, full_name)
      VALUES ($1, $2, $3)
      RETURNING id, email, full_name, role
    `;
    const values = [email, passwordHash, fullName];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  async login(email, password) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    delete user.password_hash;
    return user;
  }

  async findById(id) {
    const result = await db.query('SELECT id, email, full_name, role FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = new UserService();
