import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';

import { UsePipes } from '@nestjs/common';
import { WSPipe } from 'src/exception/websockets/ws-exception-filter'

import { Channel, ChannelType, User, UserChannelRole } from 'db-interface/Core';
import { JoinChannelDto } from './dto/join-channel.dto';

import { UserService } from '../user/user.service';

import { UserChannelService } from '../user-channel/user-channel.service';
import { CreateUserChannelDto } from '../user-channel/dto/create-user-channel.dto';

@UsePipes(WSPipe)
@WebSocketGateway({cors: {origin: '*'}})
export class ChannelGateway
{
  constructor(private channelService: ChannelService,
              private userService: UserService,
              private userChannelService: UserChannelService,  
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChannelGateway');

  // private sendToNoBlockedUser(user: User, payload: any, event: string): void
  // {
  //   const userList = 
  //   this.server.emit(event, payload);
  // }


  @SubscribeMessage('createChannel')
  async createNewChan(client: any, payload: CreateChannelDto): Promise<void> 
  {
    try 
    {
      const token = client.handshake.auth.token;
      this.userService.checkToken(token);
      const user = await this.userService.getUserByToken(token);
      const new_chan = await this.channelService.create(payload, user);

	  const userChannelData: CreateUserChannelDto =
      {
        userId: user.id,
        channelId: new_chan.id
      }
      this.userChannelService.create(userChannelData, UserChannelRole.owner);

      // if (new_chan.type != ChannelType.direct)
	  this.sendAllChan(client)
    } catch (error) 
    {
      this.server.to(client.id).emit('chatError', error.message);
    }
  }

  @SubscribeMessage('getAllChannels')
  async sendAllChan(client: Socket)
  {
    try {
      const token = client.handshake.auth.token;
      // this.userService.checkToken(token);
      // const user = await this.userService.getUserByToken(token);
      const all_chan = await this.channelService.findAll();
	  
      this.server.emit('allChansToClient', all_chan);
    } catch (error) {
      this.server.to(client.id).emit('chatError', error.message);
    }
  }

  @SubscribeMessage('getChannelUsers')
  async sendChannelUsers(client: Socket, payload: JoinChannelDto)
  {
	try 
	{
		const userchannels = await this.userChannelService.findByChanId(payload.id);
		const sentDatas = 
		{
			channelId: payload.id,
			userchannels: userchannels
		}
		for (let userchan of userchannels)
		{
			this.server.to(userchan.user.chatSocketId).emit('channelUsersToClient', sentDatas);
		}
	} 
	catch (error)
	{
		this.server.to(client.id).emit('chatError', error.message);
	}
  }

  @SubscribeMessage('joinChannel')
  async sendChanMessages(client: Socket, payload: JoinChannelDto)
  {
    try {
      const token = client.handshake.auth.token;
      // this.userService.checkToken(payload.token);
      const user = await this.userService.getUserByToken(token);

      // const chan = checkChanValidity(payload.id, payload.password);

	

      //joining channel

      // check if user is not banned
      const userChannelData: CreateUserChannelDto =
      {
        userId: user.id,
        channelId: payload.id
      }
      this.userChannelService.create(userChannelData)

      // const chanMessages = await this.channelService.findMessagesWithPassword(payload)
      
      const chanMessages = await this.channelService.findMessages(payload.id)
      const sentPayload =
      {
        locked: false,
        messages: chanMessages,
      }
      this.server.to(client.id).emit('allChanMessagesToClient', sentPayload);
	  this.sendChannelUsers(client, payload);
      
    } catch (error) {
      this.server.to(client.id).emit('allChanMessagesToClient', {locked: true, messages: {}});
      this.server.to(client.id).emit('chatError', error.message);
    }

  }
}
