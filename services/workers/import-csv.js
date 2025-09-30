const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const csvParse = require('csv-parse');

async function importCsv(filePath) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const parser = fs
      .createReadStream(filePath)
      .pipe(csvParse.parse({ columns: true, skip_empty_lines: true }));

    for await (const record of parser) {
      const title = record.title || record.name;
      const description = record.description || null;
      const priceCents = Math.round(parseFloat(record.price) * 100);
      const currency = record.currency || 'USD';
      const imageUrl = record.image_url || record.image || null;
      const stock = parseInt(record.stock || '0', 10);
      await client.query(
        `INSERT INTO products (title, description, price_cents, currency, image_url, stock)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT DO NOTHING`,
        [title, description, priceCents, currency, imageUrl, stock]
      );
    }

    await client.query('COMMIT');
    console.log('CSV import completed');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('CSV import failed:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

const target = process.argv[2] || process.env.CSV_IMPORT_PATH;
if (!target) {
  console.error('CSV path missing. Pass as arg or set CSV_IMPORT_PATH');
  process.exit(1);
}
const abs = path.resolve(target);
if (!fs.existsSync(abs)) {
  console.error('CSV file not found:', abs);
  process.exit(1);
}

importCsv(abs);