import { BadRequestException, Injectable, Logger, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Events } from 'src/common/Models/event.entity';
import { ExceptionHandler } from 'src/common/helpers/handle.exceptions';

@Injectable()
export class EventsService {
  private readonly logger = new Logger('Events');

  constructor(
    @InjectModel(Events.name)
    private readonly eventModel: Model<Events>,
  ) {}

  private trimStrings(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      }
    }
  }

  async create(createEventDto: CreateEventDto) {
    this.trimStrings(createEventDto);

    try {
      const event = await this.eventModel.create(createEventDto);

      return {
        ok: true,
        message: 'Event created',
        event: {
          ...event,
        },
      };
    } catch (error) {
      ExceptionHandler.handle(error);
    }
  }

  async findAll() {
    try {
      const events = await this.eventModel.find();

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

  async findOne(@Param() id: string) {
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

  async update(id: string, updateEventDto: UpdateEventDto) {
    try {
      await this.findOne(id);

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

  async remove(id: string) {
    try {
      await this.findOne(id);

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
