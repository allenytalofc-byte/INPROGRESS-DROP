import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const email = 'admin@local.test';
    const name = 'Admin';
    const password = 'admin123';
    const role = 'admin';
    const existing = await client.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) {
      console.log('Admin already exists');
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await client.query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1,$2,$3,$4)`,
      [email, passwordHash, name, role]
    );
    console.log('Admin user created:', email, 'password:', password);
  } catch (e) {
    console.error('Seed failed', e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();