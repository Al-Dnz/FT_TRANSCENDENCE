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

import { Channel } from 'db-interface/Core';
import { JoinChannelDto } from './dto/join-channel.dto';

import { UserService } from '../user/user.service';

import { UserChannelService } from '../user-channel/user-channel.service';
import { CreateUserChannelDto } from '../user-channel/dto/create-user-channel.dto';

@UsePipes(WSPipe)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChannelGateway
{

  constructor(private channelService: ChannelService,
              private userService: UserService,
              private userChannelService: UserChannelService,
              
  ) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChannelGateway');


  @SubscribeMessage('createChannel')
  async createNewChan(client: any, payload: CreateChannelDto): Promise<void> 
  {
    try 
    {
      const new_chan = await this.channelService.create(payload);
      this.server.emit('chanToClient', new_chan);
    } catch (error) 
    {
      this.server.to(client.id).emit('chatError', error.message);
    }
  
  }

  @SubscribeMessage('getAllChannels')
  async sendAllChan(client: Socket)
  {
    const all_chan = await this.channelService.findAll();
    this.server.emit('allChansToClient', all_chan);
  }

  @SubscribeMessage('getAllMessagesOfChannel')
  async sendChanMessages(client: Socket, payload: JoinChannelDto)
  {
    try {
      // this.userService.checkToken(payload.token);
      const user = await this.userService.getUserByToken(payload.token);
      this.logger.log("GET USER BY TOKEN =>");
      this.logger.log(user);

      //joining channel
      const userChannelData: CreateUserChannelDto =
      {
        userId: user.id,
        channelId: payload.id
      }
      this.userChannelService.create(userChannelData)

      // const chanMessages = await this.channelService.findMessagesWithPassword(payload)
      const chanMessages = await this.channelService.findMessages(payload.id)
      
      this.server.to(client.id).emit('allChanMessagesToClient', chanMessages);
      
    } catch (error) {
      this.server.to(client.id).emit('chatError', error.message);
    }

  }
}
