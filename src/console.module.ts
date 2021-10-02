import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { ConsoleModule } from 'nestjs-console';
import { DatabaseRefreshService } from './commands/database';

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [ConsoleModule, ConfigModule.forRoot(), MikroOrmModule.forRoot()],
  providers: [DatabaseRefreshService],
  exports: [DatabaseRefreshService],
})
export class AppConsoleModule {}
