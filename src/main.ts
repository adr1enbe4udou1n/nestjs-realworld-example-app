import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EntityNotFoundFilter } from './filters/entity-not-found.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app
    .useGlobalPipes(new ValidationPipe())
    .setGlobalPrefix('api')
    .useGlobalFilters(new EntityNotFoundFilter());

  const config = new DocumentBuilder()
    .setTitle('Conduit API')
    .setDescription('Conduit API')
    .setVersion('1.0.0')
    .setContact('RealWorld', 'https://realworld.io/', 'contact@realworld.io')
    .setLicense('MIT Licence', 'https://opensource.org/licenses/MIT')
    .addBearerAuth()
    .addServer('/api')
    .addTag('Articles')
    .addTag('Comments')
    .addTag('Favorites')
    .addTag('Profile')
    .addTag('Tags')
    .addTag('User and Authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
