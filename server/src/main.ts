import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Load root .env so DB_* and other vars are set (try two possible roots: from dist/ or from server/)
function loadEnv(path: string) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    process.env[key] = value;
  }
}
loadEnv(resolve(__dirname, '..', '..', '.env'));
loadEnv(resolve(process.cwd(), '..', '.env'));

// Confirm DB env is loaded (so we know .env was read before TypeORM connects)
const dbEnvLoaded =
  process.env.DB_HOST &&
  process.env.DB_USER &&
  process.env.DB_NAME &&
  process.env.DB_PASSWORD;
if (!dbEnvLoaded) {
  console.warn(
    '[env] DB_* not all set. Using defaults. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in root .env',
  );
} else {
  console.log(
    `[env] DB loaded: host=${process.env.DB_HOST} port=${process.env.DB_PORT} db=${process.env.DB_NAME} user=${process.env.DB_USER}`,
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Webstore API')
    .setDescription('API for webstore')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
