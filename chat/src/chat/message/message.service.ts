import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from './message.entity';

import { Channel } from 'src/chat/channel/channel.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
  ) {}


  // @Inject(ChannelService)
  // private readonly channelService: ChannelService;

  async create(data: CreateMessageDto): Promise<Message> 
  {
    const message = new Message();
    message.text = data.text;
    message.sender = data.sender;

    const channel = await this.channelsRepository.findOneBy({id: data.channelId}) ;
    message.channel = channel;

    return this.messagesRepository.save(message);
  }

  async findAll(): Promise<Message[]> 
  {
    return this.messagesRepository.find();
  }

  findOne(id: number)
  {
    return this.messagesRepository.findOneBy({ id: id });
  }

  update(id: number, updateMessageDto: UpdateMessageDto)
  {
    return `This action updates a #${id} message`;
  }

  async remove(id: number) 
  {
    return this.messagesRepository.delete(id);
  }
}
