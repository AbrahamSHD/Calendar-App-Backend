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
import { JwtAuthGuard } from 'src/common/guards/jwt-guard.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Headers('authorization') token: string,
    @Body() createEventDto: CreateEventDto,
  ) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.eventsService.remove(id);
  }
}
