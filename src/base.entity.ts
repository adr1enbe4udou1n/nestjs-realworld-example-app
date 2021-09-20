import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey()
  id?: number;

  @Property({ columnType: 'timestamp' })
  created_at? = new Date();

  @Property({ columnType: 'timestamp', onUpdate: () => new Date() })
  updated_at? = new Date();
}
