import { EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Article } from './article/article.entity';
import { HasTimestamps } from './has-timestamps';

export class TimestampsSubscriber implements EventSubscriber {
  async beforeCreate(args: EventArgs<HasTimestamps>): Promise<void> {
    if (!args.entity.created_at) {
      args.entity.created_at = new Date();
    }

    args.entity.updated_at = args.entity.created_at;
  }

  async beforeUpdate(args: EventArgs<Article>): Promise<void> {
    if (!args.entity.updated_at) {
      args.entity.updated_at = new Date();
    }
  }
}
