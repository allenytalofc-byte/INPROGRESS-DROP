#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  await client.query('CREATE TABLE IF NOT EXISTS _migrations (id serial primary key, filename text unique, executed_at timestamptz not null default now())');

  const migrationsDir = path.resolve(__dirname, '../migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const res = await client.query('SELECT 1 FROM _migrations WHERE filename=$1', [file]);
    if (res.rowCount > 0) {
      console.log(`Skipping ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Applying ${file}...`);
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO _migrations(filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`Applied ${file}`);
    } catch (e) {
      await client.query('ROLLBACK');
      console.error(`Failed ${file}:`, e.message);
      await client.end();
      process.exit(1);
    }
  }
  await client.end();
  console.log('Migrations complete.');
}

run();