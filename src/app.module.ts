import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    DatabaseModule,
    EventsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL, {
      dbName: process.env.MONGO_DB_NAME,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
