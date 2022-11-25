import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const chan = this.channelService.findOne(+id);
	if (chan)
		return chan
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string)
  {
    return this.channelService.findMessages(+id);  
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string)
  {
	const chan = this.channelService.findOne(+id);
	if (chan)
   		return this.channelService.remove(+id);
  }
}
