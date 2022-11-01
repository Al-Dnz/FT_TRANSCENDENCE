import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './channel.entity';
import { Message } from '../message/message.entity';

import { Logger } from '@nestjs/common';

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

  findOne(id: number) {
    return this.channelsRepository.findOneBy({ id: id });
  }

  private logger: Logger = new Logger('MessageGateway');

  async findMessages(id: number)
  {
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
    await this.channelsRepository.delete(id);
  }

}
