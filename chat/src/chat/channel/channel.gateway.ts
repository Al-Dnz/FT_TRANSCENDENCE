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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChannelGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

  constructor(private messageService: ChannelService) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChannelGateway');


  @SubscribeMessage('chanToServer')
  async handleMessage(client: any, payload: CreateChannelDto): Promise<void> {
    await this.messageService.create(payload);
    
    this.server.emit('chanToClient', payload);
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
