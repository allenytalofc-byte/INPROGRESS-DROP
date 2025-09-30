import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const distMigrations = join(__dirname, '..', 'migrations');
    const rootMigrations = join(__dirname, '..', '..', 'migrations');
    const dir = existsSync(distMigrations) ? distMigrations : rootMigrations;
    const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
    for (const file of files) {
      const sql = readFileSync(join(dir, file), 'utf8');
      await client.query(sql);
    }
    await client.query('COMMIT');
    console.log('Migrations applied');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration failed', e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();