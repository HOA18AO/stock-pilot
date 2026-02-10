require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const { Client } = require('pg');
const bcrypt = require('bcrypt');

const username = 'admin';
const password = 'admin';
const role = 'manager';
const name = 'The Chosen One';

if (!['admin', 'manager'].includes(role)) {
  console.error('role must be admin or manager');
  process.exit(1);
}

const code = username;

async function main() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'webstore',
  });

  try {
    await client.connect();
    const hashed = await bcrypt.hash(password, 10);
    await client.query(
      `INSERT INTO "user" (name, code, mobile, username, password, role, active)
       VALUES ($1, $2, NULL, $3, $4, $5, true)`,
      [name, code, username, hashed, role],
    );
    console.log('User created:', { username, role, code });
  } catch (e) {
    if (e.code === '23505') {
      console.error(
        'User already exists (duplicate username or code):',
        username,
      );
    } else {
      console.error(e.message || e);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
