import { Logger, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Seeder } from './seeder';

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [MikroOrmModule.forRoot()],
  providers: [Logger, Seeder],
})
export class SeederModule {}
