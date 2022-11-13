import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';

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

  private logger: Logger = new Logger('MessageService');

  async create(data: CreateMessageDto): Promise<Message> 
  {
    const message = new Message();
	if (data.text && data.text.length > 0)	
		message.text = data.text;
	else
		throw new HttpException("message text is empty", HttpStatus.FAILED_DEPENDENCY);

	if (data.private)
		message.private = data.private;

	if (data.senderId)
	{
		const sender = await this.usersRepository.findOneBy({id: data.senderId});
		if (!sender)
			throw new HttpException("this user sender doesn't exist", HttpStatus.FAILED_DEPENDENCY);
		message.sender = sender;
	}
	if (data.channelId)
	{
		const channel = await this.channelsRepository.findOneBy({id: data.channelId}) ;
		if (!channel)
			throw new HttpException("this channel doesn't exist", HttpStatus.FAILED_DEPENDENCY);
		message.channel = channel;
	}
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
	else
	{
		this.messagesRepository.delete(id);
		throw new HttpException(`message #${id} was deleted successfully`, HttpStatus.OK);
	}
  }
}
