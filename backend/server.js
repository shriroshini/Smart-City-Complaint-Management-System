const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const { initDb, getDb, saveDb } = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// One-time admin reset endpoint (safe - only creates/resets admin)
app.get('/setup-admin', async (req, res) => {
  try {
    const { getDb, saveDb } = require('./config/database');
    const bcrypt = require('bcryptjs');
    const db = getDb();
    const hashedPassword = await bcrypt.hash('admin123', 10);
    // Delete existing admin and recreate fresh
    db.run('DELETE FROM users WHERE email = ?', ['admin@smartcity.com']);
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin', 'admin@smartcity.com', hashedPassword, 'admin']
    );
    saveDb();
    res.json({ message: '✅ Admin created. Email: admin@smartcity.com | Password: admin123' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5001;

// Auto-seed admin user if not exists
const seedAdmin = async () => {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const existing = stmt.getAsObject(['admin@smartcity.com']);
  if (!existing.id) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin', 'admin@smartcity.com', hashedPassword, 'admin']
    );
    saveDb();
    console.log('✅ Admin user created: admin@smartcity.com / admin123');
  } else {
    console.log('✅ Admin user already exists');
  }
};

// Initialize SQLite DB then start server
initDb()
  .then(async () => {
    await seedAdmin();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.log(`🔧 Run this to fix it: lsof -ti :${PORT} | xargs kill -9`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  })
  .catch(err => {
    console.error('❌ Failed to initialize database:', err.message);
    process.exit(1);
  });
