const { initDb, getDb, saveDb } = require('./config/database');
const bcrypt = require('bcryptjs');

const ADMIN_NAME = 'Admin';
const ADMIN_EMAIL = 'admin@smartcity.com';
const ADMIN_PASSWORD = 'admin123';

initDb().then(async () => {
  const db = getDb();

  // Check if admin already exists
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const existing = stmt.getAsObject([ADMIN_EMAIL]);

  if (existing.id) {
    // Update role to admin just in case
    db.run('UPDATE users SET role = ? WHERE email = ?', ['admin', ADMIN_EMAIL]);
    saveDb();
    console.log('✅ Admin user already exists — role confirmed as admin');
    console.log(`   Email   : ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  db.run(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [ADMIN_NAME, ADMIN_EMAIL, hashedPassword, 'admin']
  );
  saveDb();

  console.log('✅ Admin user created successfully!');
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
