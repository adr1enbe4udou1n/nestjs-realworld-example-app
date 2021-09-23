import { Logger, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { Seeder } from './seeder';

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [ConfigModule.forRoot(), MikroOrmModule.forRoot()],
  providers: [Logger, Seeder],
})
export class SeederModule {}
