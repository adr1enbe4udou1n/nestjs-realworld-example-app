import { EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Article } from './articles/article.entity';
import { HasTimestamps } from './has-timestamps';

export class TimestampsSubscriber implements EventSubscriber {
  async beforeCreate(args: EventArgs<HasTimestamps>): Promise<void> {
    if (!args.entity.createdAt) {
      args.entity.createdAt = new Date();
    }

    args.entity.updatedAt = args.entity.createdAt;
  }

  async beforeUpdate(args: EventArgs<Article>): Promise<void> {
    if (!args.entity.updatedAt) {
      args.entity.updatedAt = new Date();
    }
  }
}
