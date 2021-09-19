import { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  type: 'postgresql',
  host: 'localhost',
  port: 5433,
  user: 'main',
  password: 'main',
  dbName: 'main',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
};

export default config;
