import { Migration } from '@mikro-orm/migrations';

export class Migration20210921181417 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "users" ("id" serial primary key, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "bio" text null, "image" varchar(255) null, "created_at" timestamp null, "updated_at" timestamp null);',
    );

    this.addSql(
      'create table "follower_user" ("follower_id" int4 not null, "following_id" int4 not null);',
    );
    this.addSql(
      'alter table "follower_user" add constraint "follower_user_pkey" primary key ("follower_id", "following_id");',
    );

    this.addSql(
      'alter table "follower_user" add constraint "follower_user_follower_id_foreign" foreign key ("follower_id") references "users" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "follower_user" add constraint "follower_user_following_id_foreign" foreign key ("following_id") references "users" ("id") on update cascade on delete cascade;',
    );
  }
}
