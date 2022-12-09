import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { CreateUserChannelDto } from './dto/create-user-channel.dto';

import { UserChannel, Channel, User } from 'db-interface/Core';


import { Logger } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';


@Injectable()
export class UserChannelService {

  constructor(
    @InjectRepository(UserChannel)
      private readonly userChannelsRepository: Repository<UserChannel>,
    @InjectRepository(Channel)
      private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(User)
      private readonly usersRepository: Repository<User>,
  ){}

  private logger: Logger = new Logger('ChannelService');


  async create(createUserChannelDto: CreateUserChannelDto)
  { 
    const toFind = await this.userChannelsRepository.find(
      {
          relations: {
            channel: true,
            user: true,
          },
          where: {
            channel: {
              id: createUserChannelDto.channelId,
            },
            user: {
              id: createUserChannelDto.userId
            }
          },
      })

      this.logger.log("userchannel to fine =>");
      this.logger.log(toFind);

      if (toFind.length)
        return;

    const userChannel = new UserChannel();

    const channel = await this.channelsRepository.findOneBy({ id: createUserChannelDto.channelId });
	  if (!channel)
		  throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

    const user = await this.usersRepository.findOneBy({ id: createUserChannelDto.userId });
    if (!user)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    userChannel.user = user;
    userChannel.channel = channel;
    return this.userChannelsRepository.save(userChannel);
  }

  async findAll() {
    return await this.userChannelsRepository.find();
  }

  async findOne(id: number) 
  {
    const userChannel = await this.userChannelsRepository.findOneBy({ id: id });
    if (!userChannel)
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
  }

  // update(id: number, updateUserChannelDto: UpdateUserChannelDto) {
  //   return `This action updates a #${id} userChannel`;
  // }

  async remove(id: number)
  {
    const userChannel = await this.userChannelsRepository.findOneBy({ id: id })
    if (!userChannel)
      throw new HttpException('userChannel not found', HttpStatus.NOT_FOUND);
  }

}
