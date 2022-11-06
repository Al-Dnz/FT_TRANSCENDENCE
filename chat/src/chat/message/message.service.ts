import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HttpException, HttpStatus } from '@nestjs/common';

import { Message } from './message.entity';

import { Channel } from 'src/chat/channel/channel.entity';

import { User } from 'src/user/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
	@InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: CreateMessageDto): Promise<Message> 
  {
    const message = new Message();
    message.text = data.text;

	const sender = await this.usersRepository.findOneBy({id: data.senderId}) ;
	
    message.sender = sender;
    const channel = await this.channelsRepository.findOneBy({id: data.channelId}) ;
	
    message.channel = channel;

    return this.messagesRepository.save(message);
  }

  async findAll(): Promise<Message[]> 
  {
    return this.messagesRepository.find();
  }

  async findOne(id: number)
  {
	const message = await this.messagesRepository.findOneBy({ id: id })
	if (!message)
		throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    return this.messagesRepository.findOneBy({ id: id });
  }

  update(id: number, updateMessageDto: UpdateMessageDto)
  {
    return `This action updates a #${id} message`;
  }

  async remove(id: number) 
  {
	const message = await this.messagesRepository.findOneBy({ id: id })
	if (!message)
		throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    return this.messagesRepository.delete(id);
  }
}
