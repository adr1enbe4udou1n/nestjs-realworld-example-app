import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), MikroOrmModule.forRoot()],
  exports: [ConfigModule, MikroOrmModule],
})
export class CoreModule {}
