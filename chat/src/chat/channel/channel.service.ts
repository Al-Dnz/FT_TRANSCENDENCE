import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';

import { Body } from '@nestjs/common';

import * as bcrypt from 'bcrypt';


import { Channel, Message, User } from 'db-interface/Core';

import { Logger } from '@nestjs/common';

import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ChannelService {

  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>
    
  ) {}

  private logger: Logger = new Logger('ChannelService');

  private saltOrRounds = 10;

  async create(createChannelDto: CreateChannelDto, user?: User) 
  {
    const channel = new Channel();
    channel.name = createChannelDto.name;
    const same_named_channel = await this.channelsRepository.findOneBy({ name: channel.name });
    if (same_named_channel)
      throw new HttpException("another chan with this name still exists", HttpStatus.FAILED_DEPENDENCY);
    if (createChannelDto.password)
      channel.password = await bcrypt.hash(createChannelDto.password, this.saltOrRounds);
    if (createChannelDto.type)
      channel.type = createChannelDto.type
    if (user)
      channel.creator = user;

    return this.channelsRepository.save(channel);
  }

  async findAll() {
    return await this.channelsRepository.find();
  }

  getAllChannels()
  {
    
  }

  async findOne(id: number) {
    const channel = await this.channelsRepository.findOneBy({ id: id });
	if (!channel)
		throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
	else
		return channel;
  }

  async findMessages(id: number)
  {
    const channel = await this.channelsRepository.findOneBy({ id: id });
    if (!channel)
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
    return await this.messagesRepository.find(
    {
        relations: {
          channel: true,
          sender: true,
        },
        where: {
          channel: {
            id: id,
          },
        },
    })
  }

  async checkChanValidity(payload: JoinChannelDto)
  {
    const channel = await this.channelsRepository
              .createQueryBuilder("channel")
              .where("channel.id = :id", { id: payload.id })
              .addSelect("channel.password")
              .getOne();
    if (!channel)
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

    const passwordMatch = bcrypt.compareSync(payload.password, channel.password);
    if (!passwordMatch)
      throw new HttpException('Channel password is wrong',  HttpStatus.FORBIDDEN);
    
    return channel
  }

  async findMessagesWithPassword(body: JoinChannelDto)
  {
    this.logger.log("BODY ->");
    this.logger.log(body.password);
    // const channel = await this.channelsRepository.findOneBy({ id: body.id });

    const channel = await this.channelsRepository
              .createQueryBuilder("channel")
              .where("channel.id = :id", { id: body.id })
              .addSelect("channel.password")
              .getOne();

    if (!channel)
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
    this.logger.log("chan ->");
    this.logger.log(channel.name);
    this.logger.log(channel.password);
    if (channel.password)
    {
      if (!body.password)
        throw new HttpException('Channel password is needed',  HttpStatus.FORBIDDEN);
    
      const passwordMatch = bcrypt.compareSync(body.password, channel.password);
      if (!passwordMatch)
        throw new HttpException('Channel password is wrong',  HttpStatus.FORBIDDEN);
    }
      
    return await this.messagesRepository.find({
      relations: {
        channel: true,
        sender: true,
      },
      where: {
        channel: {
          id: body.id,
        },
      },
    })
  }

  // update(id: number, updateChannelDto: UpdateChannelDto) {
  //   return `This action updates a #${id} channel`;
  // }

  chanAllowedUsers(channel: Channel, sender?: User): User[]
  {
    let arr: User[];
     for (let user_channel of channel.userChannels)
     {
        let user: User = user_channel.user;
        // if(user IS NOT MUTE BY CHANNEL AND NOT BLOCKED BY SENDER)
          arr.push(user);
     }
     return arr;
  }

  async remove(id: number) 
  {
    const channel = await this.channelsRepository.findOneBy({ id: id })
    if (!channel)
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
    else if (channel.unremovable == false)
    {
      await this.channelsRepository.delete(id);
      throw new HttpException(`Channel #${id} was deleted succesfully`, HttpStatus.OK);
    }
    else
      throw new HttpException('Forbidden: unremovable channel', HttpStatus.FORBIDDEN);
  }
}
