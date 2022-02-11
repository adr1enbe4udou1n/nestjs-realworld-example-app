import { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { TimestampsSubscriber } from './src/timestamps.subscriber';

const config: Options = {
  subscribers: [new TimestampsSubscriber()],
  type: 'postgresql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: process.env.NODE_ENV !== 'production',
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  migrations:
    process.env.NODE_ENV === 'production'
      ? {
          path: 'dist/migrations',
          glob: '!(*.d).{js,ts}',
          disableForeignKeys: false,
        }
      : { path: 'src/migrations', glob: '!(*.d).{js,ts}' },
};

export default config;
