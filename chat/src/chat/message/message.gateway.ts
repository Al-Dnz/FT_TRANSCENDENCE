import {
  WsException,
  WsResponse,
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

import { UsePipes, ValidationPipe } from '@nestjs/common';

import { WSPipe } from 'src/exception/websockets/ws-exception-filter'

import { UserService } from '../user/user.service';
import { IMessage } from '../interface/message.interface';

@UsePipes(WSPipe)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 
{
  constructor(private messageService: MessageService,
              private userService: UserService,   
    ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');


  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: CreateMessageDto):  Promise<void>
  {
    try 
    {
      // this.userService.checkToken(payload.token)
      this.logger.log("***MSG CREATING 1 ...");
      const user = await this.userService.getUserByToken(payload.token);
      this.logger.log("***MSG CREATING 2 ...");
      const msgData: IMessage =
      {
        sender: user,
        channelId: payload.channelId,
        text: payload.text
      }
      this.logger.log("***MSG CREATING 3 ...");
      const new_message = await this.messageService.create(msgData);
      this.logger.log("HERE MESSAGE WEBSOCKET V4==>")
      this.logger.log(new_message);
      this.server.emit(`msgToChannel`, new_message);

    } 
    catch (error)
    {
      this.server.to(client.id).emit('chatError', error);
    }
  
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
