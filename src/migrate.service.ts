import { MikroORM } from '@mikro-orm/core';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class MigrateService implements OnModuleInit {
  constructor(private orm: MikroORM) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      await this.orm.getMigrator().up();
      await this.orm.close(true);
    }
  }
}
