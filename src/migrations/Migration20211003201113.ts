import { Migration } from '@mikro-orm/migrations';

export class Migration20211003201113 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) null, "bio" text null, "image" varchar(255) null, "created_at" timestamp not null, "updated_at" timestamp not null);');

    this.addSql('create table "follower_user" ("following_id" int4 not null, "follower_id" int4 not null);');
    this.addSql('alter table "follower_user" add constraint "follower_user_pkey" primary key ("following_id", "follower_id");');

    this.addSql('create table "tags" ("id" serial primary key, "name" varchar(255) not null, "created_at" timestamp not null, "updated_at" timestamp not null);');
    this.addSql('alter table "tags" add constraint "tags_name_unique" unique ("name");');

    this.addSql('create table "articles" ("id" serial primary key, "author_id" int4 not null, "title" varchar(255) not null, "slug" varchar(255) not null, "description" text not null, "body" text not null, "created_at" timestamp not null, "updated_at" timestamp not null);');
    this.addSql('alter table "articles" add constraint "articles_slug_unique" unique ("slug");');

    this.addSql('create table "comments" ("id" serial primary key, "article_id" int4 not null, "author_id" int4 not null, "body" text not null, "created_at" timestamp not null, "updated_at" timestamp not null);');

    this.addSql('create table "article_tag" ("article_id" int4 not null, "tag_id" int4 not null);');
    this.addSql('alter table "article_tag" add constraint "article_tag_pkey" primary key ("article_id", "tag_id");');

    this.addSql('create table "article_favorite" ("article_id" int4 not null, "user_id" int4 not null);');
    this.addSql('alter table "article_favorite" add constraint "article_favorite_pkey" primary key ("article_id", "user_id");');

    this.addSql('alter table "follower_user" add constraint "follower_user_following_id_foreign" foreign key ("following_id") references "users" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "follower_user" add constraint "follower_user_follower_id_foreign" foreign key ("follower_id") references "users" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "articles" add constraint "articles_author_id_foreign" foreign key ("author_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "comments" add constraint "comments_article_id_foreign" foreign key ("article_id") references "articles" ("id") on update cascade;');
    this.addSql('alter table "comments" add constraint "comments_author_id_foreign" foreign key ("author_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "article_tag" add constraint "article_tag_article_id_foreign" foreign key ("article_id") references "articles" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "article_tag" add constraint "article_tag_tag_id_foreign" foreign key ("tag_id") references "tags" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "article_favorite" add constraint "article_favorite_article_id_foreign" foreign key ("article_id") references "articles" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "article_favorite" add constraint "article_favorite_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');
  }

}
