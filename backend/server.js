const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDb } = require('./config/database');

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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5001;

// Initialize SQLite DB then start server
initDb()
  .then(() => {
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
