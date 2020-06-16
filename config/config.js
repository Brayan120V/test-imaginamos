import { Pool } from 'pg';

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

if (process.env.NODE_ENV === 'production') { process.env.DATABASE_URL = process.env.DATABASE_URL; } else if (process.env.NODE_ENV === 'test') { process.env.DATABASE_URL = process.env.DB_TEST; } else { process.env.DATABASE_URL = process.env.DB_DEVELOPMENT; }

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction,
});

module.exports = pool;
