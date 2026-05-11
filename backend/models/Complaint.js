const { getDb, saveDb } = require('../config/database');

// Shape a raw DB row into the format the frontend expects
const formatComplaint = (row) => {
  if (!row || !row.id) return null;
  return {
    ...row,
    _id: row.id,                          // frontend uses _id
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
      address: row.address || ''
    }
  };
};

// Helper to join user info onto a complaint row
const withUser = (complaint, db) => {
  if (!complaint) return null;
  const userStmt = db.prepare('SELECT id, name, email FROM users WHERE id = ?');
  const user = userStmt.getAsObject([complaint.userId]);
  return {
    ...complaint,
    userId: user.id ? { _id: user.id, name: user.name, email: user.email } : complaint.userId
  };
};

// Run a SELECT and return all rows as array of objects
const queryAll = (db, sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
};

const Complaint = {
  // Create a new complaint
  create({ userId, title, description, category, priority, latitude, longitude, address, beforeImage }) {
    const db = getDb();
    db.run(
      `INSERT INTO complaints (userId, title, description, category, priority, latitude, longitude, address, beforeImage)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, description, category, priority || 'medium', latitude, longitude, address || '', beforeImage]
    );
    saveDb();
    const stmt = db.prepare('SELECT * FROM complaints WHERE id = last_insert_rowid()');
    return formatComplaint(stmt.getAsObject());
  },

  // Find by id
  findById(id) {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM complaints WHERE id = ?');
    const row = stmt.getAsObject([id]);
    return formatComplaint(row);
  },

  // Find all complaints by userId
  findByUserId(userId) {
    const db = getDb();
    return queryAll(db, 'SELECT * FROM complaints WHERE userId = ? ORDER BY createdAt DESC', [userId])
      .map(formatComplaint);
  },

  // Find all complaints with optional filters, with user info
  findAll({ status, priority } = {}) {
    const db = getDb();
    let sql = 'SELECT * FROM complaints WHERE 1=1';
    const params = [];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (priority) { sql += ' AND priority = ?'; params.push(priority); }
    sql += ' ORDER BY createdAt DESC';
    const complaints = queryAll(db, sql, params);
    return complaints.map(c => withUser(formatComplaint(c), db));
  },

  // Update status (and resolvedAt if resolved)
  updateStatus(id, status) {
    const db = getDb();
    if (status === 'resolved') {
      db.run(
        "UPDATE complaints SET status = ?, resolvedAt = datetime('now') WHERE id = ?",
        [status, id]
      );
    } else {
      db.run('UPDATE complaints SET status = ? WHERE id = ?', [status, id]);
    }
    saveDb();
    return this.findById(id);
  },

  // Update after image
  updateAfterImage(id, afterImage) {
    const db = getDb();
    db.run('UPDATE complaints SET afterImage = ? WHERE id = ?', [afterImage, id]);
    saveDb();
    return this.findById(id);
  },

  // Count with optional filter
  count(filter = {}) {
    const db = getDb();
    let sql = 'SELECT COUNT(*) as cnt FROM complaints WHERE 1=1';
    const params = [];
    if (filter.status) { sql += ' AND status = ?'; params.push(filter.status); }
    if (filter.priority) { sql += ' AND priority = ?'; params.push(filter.priority); }
    const stmt = db.prepare(sql);
    const row = stmt.getAsObject(params);
    return row.cnt || 0;
  }
};

module.exports = Complaint;
