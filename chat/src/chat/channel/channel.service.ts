import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './channel.entity';
import { Message } from '../message/message.entity';

import { Logger } from '@nestjs/common';

import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ChannelService {

  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  create(createChannelDto: CreateChannelDto) {
    const channel = new Channel();
    channel.name = createChannelDto.name;
 
    return this.channelsRepository.save(channel);
  }

  async findAll() {
    return this.channelsRepository.find();
  }

  async findOne(id: number) {
    const channel = await this.channelsRepository.findOneBy({ id: id });
	if (!channel)
		throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
	else
		return channel;
  }

  private logger: Logger = new Logger('MessageGateway');

  async findMessages(id: number)
  {
	const channel = await this.channelsRepository.findOneBy({ id: id });
	if (!channel)
		throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
    return await this.messagesRepository.find({
      relations: {
        channel: true,
      },
      where: {
        channel: {
          id: id,
        },
      },
    })
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  async remove(id: number) {
	const channel = await this.channelsRepository.findOneBy({ id: id })
	if (!channel)
		throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
	else if (channel.unremovable == false)
		await this.channelsRepository.delete(id);
	else
		throw new HttpException('Forbidden: unremovable channel', HttpStatus.FORBIDDEN);
  }
}
