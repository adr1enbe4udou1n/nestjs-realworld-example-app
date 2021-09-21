import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { Article } from '../article/article.entity';
import { BaseEntity } from '../base.entity';

@Entity({ collection: 'tags' })
export class Tag extends BaseEntity {
  @Property()
  name: string;

  @ManyToMany(() => Article, (a) => a.tags, {
    pivotTable: 'article_tag',
    joinColumn: 'article_id',
    inverseJoinColumn: 'tag_id',
    hidden: true,
  })
  articles = new Collection<Article>(this);
}
