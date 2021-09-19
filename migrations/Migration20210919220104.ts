import { Migration } from '@mikro-orm/migrations';

export class Migration20210919220104 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" serial primary key, "username" varchar(255) not null, "email" varchar(255) not null, "bio" varchar(255) not null, "image" varchar(255) not null, "password" varchar(255) not null);',
    );
  }
}
