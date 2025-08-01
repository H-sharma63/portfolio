const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrateContent() {
  try {
    const contentPath = path.resolve(__dirname, '../content.json');
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

    const client = await pool.connect();

    // Clear existing data in case of re-migration
    await client.query('DELETE FROM config');
    console.log('Cleared existing data from config table.');

    for (const key in contentData) {
      if (Object.prototype.hasOwnProperty.call(contentData, key)) {
        const value = contentData[key];
        await client.query(
          'INSERT INTO config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
          [key, JSON.stringify(value)] // JSON.stringify is important for JSONB
        );
        console.log(`Inserted/Updated key: ${key}`);
      }
    }

    console.log('Content migration complete!');
  } catch (error) {
    console.error('Error during content migration:', error);
  } finally {
    pool.end(); // Close the pool connection
  }
}

migrateContent();
