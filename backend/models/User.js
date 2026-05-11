const bcrypt = require('bcryptjs');
const { getDb, saveDb } = require('../config/database');

const User = {
  // Find user by email
  findByEmail(email) {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const result = stmt.getAsObject([email.toLowerCase().trim()]);
    return result.id ? result : null;
  },

  // Find user by id
  findById(id) {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const result = stmt.getAsObject([id]);
    return result.id ? result : null;
  },

  // Create new user
  async create({ name, email, password, role = 'user' }) {
    const db = getDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, role]
    );
    saveDb();
    // Return the newly created user
    return this.findByEmail(email);
  },

  // Compare password
  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

module.exports = User;
