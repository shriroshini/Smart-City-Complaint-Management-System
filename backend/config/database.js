const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'smartcity.db');

let db = null;

const getDb = () => {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
};

const saveDb = () => {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
};

const initDb = async () => {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log('✅ SQLite database loaded from file');
  } else {
    db = new SQL.Database();
    console.log('✅ SQLite database created fresh');
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'pending',
      address TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      beforeImage TEXT NOT NULL,
      afterImage TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      resolvedAt TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  saveDb();
  console.log('✅ SQLite tables ready');
  return db;
};

module.exports = { initDb, getDb, saveDb };
