import { Migration } from '@mikro-orm/migrations';

export class Migration20210920184034 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "bio" text null, "image" varchar(255) null, "created_at" timestamp not null, "updated_at" timestamp not null);');
  }

}
