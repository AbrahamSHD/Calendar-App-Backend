import { Logger, Provider } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { envs } from '../common/config/envs';

const logger = new Logger('DatabaseProvider');
const url = envs.mongoDbUrl;

export const databaseProvider: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      try {
        logger.log('Database connected successfully');
        const connection = await mongoose.connect(url);
        return connection;
      } catch (error) {
        logger.error('Database connection failed', error.message);
        throw new Error(
          'Failed to connect to the database. Please check the connection.',
        );
      }
    },
  },
];
