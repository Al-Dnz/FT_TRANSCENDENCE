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

@UsePipes(WSPipe)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChannelGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

  constructor(private channelService: ChannelService,
              private userService: UserService,
              
  ) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChannelGateway');


  @SubscribeMessage('chanToServer')
  async createNewChan(client: any, payload: CreateChannelDto): Promise<void> 
  {
    const new_chan = await this.channelService.create(payload);
    this.server.emit('chanToClient', new_chan);
  }

  @SubscribeMessage('requestAllChannels')
  async sendAllChan(client: Socket)
  {
    const all_chan = await this.channelService.findAll();
    this.server.emit('allChansToClient', all_chan);
  }

  @SubscribeMessage('requestAllMessagesFromChan')
  async sendChanMessages(client: Socket, payload: JoinChannelDto)
  {
    try {
      // this.userService.checkToken(payload.token);

      const user = await this.userService.getUserByToken(payload.token);
      this.logger.log("GET USER BY TOKEN =>");
      this.logger.log(user);

      // const chanMessages = await this.channelService.findMessagesWithPassword(payload)
      const chanMessages = await this.channelService.findMessages(payload.id)
      
      this.server.emit('allChanMessagesToClient', chanMessages);
      
    } catch (error) {
      this.logger.log("WS ERROR =>");
      this.logger.log(error);
      this.server.to(client.id).emit('chatError', error);
    }

  }

  afterInit(server: Server) {
    this.logger.log('Initialisation of Chan websocket');
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
