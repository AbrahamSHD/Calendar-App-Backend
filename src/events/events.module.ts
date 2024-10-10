import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Events, EventSchema } from 'src/common/Models/event.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/common/config/envs';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [
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
