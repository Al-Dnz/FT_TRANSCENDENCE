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

@UsePipes(WSPipe)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChannelGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

  constructor(private channelService: ChannelService) {}

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('ChannelGateway');


  @SubscribeMessage('chanToServer')
  async handleMessage(client: any, payload: CreateChannelDto): Promise<void> {
    const new_chan = await this.channelService.create(payload);
    
    this.logger.log("HERE CHANNEL WEBSOCKET v5==>")
    this.logger.log(new_chan);
    this.server.emit('chanToClient', new_chan);
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
