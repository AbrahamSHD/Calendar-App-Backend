import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-guard.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Headers('authorization') token: string,
    @Body() createEventDto: CreateEventDto,
  ) {
    return this.eventsService.create(createEventDto, token);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Headers('authorization') token: string) {
    return this.eventsService.findAll(token);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOneById(@Param('id', ParseMongoIdPipe) id: string) {
    return this.eventsService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Headers('authorization') token: string,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto, token);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Headers('authorization') token: string,
    @Param('id', ParseMongoIdPipe) id: string,
  ) {
    return this.eventsService.remove(id, token);
  }
}
