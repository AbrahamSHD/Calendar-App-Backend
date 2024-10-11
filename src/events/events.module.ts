import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Events, EventSchema } from '../common/Models/event.entity';
import { envs } from '../common/config/envs';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: envs.jwtSecret,
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
    MongooseModule.forFeature([
      {
        name: Events.name,
        schema: EventSchema,
      },
    ]),
  ],
})
export class EventsModule {}
