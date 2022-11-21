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

import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 
{

  constructor(private messageService: MessageService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: CreateMessageDto): Promise<void> 
  {
    await this.messageService.create(payload);

    this.logger.log("HERE WEBSOCKET==>")
    this.logger.log(payload);

    let channel_id = payload.channelId;
    this.server.emit(`msgToChannel`, payload);
  }

  afterInit(server: Server) {
    this.logger.log('Initialisation of Message websocket');
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
