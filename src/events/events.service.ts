import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Events } from 'src/common/Models/event.entity';
import { ExceptionHandler } from 'src/common/helpers/handle.exceptions';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/common/Models/user.entity';

@Injectable()
export class EventsService {
  private readonly logger = new Logger('Events');

  constructor(
    @InjectModel(Events.name)
    private readonly eventModel: Model<Events>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  private trimStrings(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      }
    }
  }

  private decodeToken(token: string) {
    const decodedToken = token.replace('Bearer ', '');
    const { email } = this.jwtService.verify(decodedToken);
    return email;
  }

  async create(createEventDto: CreateEventDto, token: string) {
    this.trimStrings(createEventDto);

    try {
      const email = this.decodeToken(token);
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      createEventDto.user = user._id.toString();

      const event = await this.eventModel.create(createEventDto);

      return {
        ok: true,
        message: 'Event created',
        event: {
          ...event,
        },
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          'Event with the same title already exists',
        );
      }
      ExceptionHandler.handle(error);
    }
  }

  async findAll(token: string) {
    try {
      const email = this.decodeToken(token);
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      const events = await this.eventModel
        .find({ user: user._id })
        .populate('user', 'name email');

      console.log(events);
      return {
        ok: true,
        message: 'Events Found',
        events: {
          ...events,
        },
      };
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  async findOne(id: string) {
    try {
      const event = await this.eventModel.findById(id);

      if (!event) {
        throw new BadRequestException(`Event with id: ${id} not found`);
      }

      return {
        ok: true,
        message: `Event with id: ${id} Found`,
        event: {
          ...event,
        },
      };
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  async findOneById(id: string) {
    try {
      const event = await this.eventModel.findById(id);

      if (!event) {
        throw new BadRequestException(`Event with id: ${id} not found`);
      }

      return {
        ok: true,
        message: `Event with id: ${id} Found`,
        event: {
          ...event,
        },
      };
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto, token: string) {
    try {
      await this.findOne(id);

      const email = this.decodeToken(token);
      const user = await this.userModel.findOne({ email });
      const event = await this.eventModel.findById(id);

      console.log(user._id);
      console.log(event.user);
      if (event.user.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'You do not have the privilege to do this action',
        );
      }

      const updatedEvent = await this.eventModel.findByIdAndUpdate(
        id,
        { $set: updateEventDto },
        { new: true },
      );

      return {
        ok: true,
        message: 'Updated event',
        event: {
          ...updatedEvent,
        },
      };
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  async remove(id: string, token: string) {
    try {
      await this.findOne(id);

      const email = this.decodeToken(token);
      const user = await this.userModel.findOne({ email });
      const event = await this.eventModel.findById(id);

      console.log(user._id);
      console.log(event.user);
      if (event.user.toString() !== user._id.toString()) {
        throw new UnauthorizedException(
          'You do not have the privilege to do this action',
        );
      }

      await this.eventModel.findByIdAndDelete(id);

      return {
        ok: true,
        message: `Event with id: ${id}, deleted`,
      };
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }
}
