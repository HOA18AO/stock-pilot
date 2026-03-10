import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load root .env first so DB_* values are available regardless current working directory.
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
// Keep default lookup as a fallback for setups that place .env beside package.json.
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'webstore',

  entities: [path.join(__dirname, '**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
  subscribers: [path.join(__dirname, '**/*.subscriber.{ts,js}')],

  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  migrationsRun: process.env.NODE_ENV === 'production',
});
