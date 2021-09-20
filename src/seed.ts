import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Seeder } from './seeder';
import { SeederModule } from './seeder.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const logger = app.get(Logger);
  const seeder = app.get(Seeder);

  try {
    await seeder.seed();
    logger.debug('Seeding complete!');
  } catch (e) {
    logger.error('Seeding failed!');
    throw e;
  } finally {
    app.close();
  }
}
bootstrap();
