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

import { UsePipes } from '@nestjs/common';
import { WSPipe } from 'src/exception/websockets/ws-exception-filter'

import { UserService } from './user/user.service';

@UsePipes(WSPipe)
@WebSocketGateway({cors: {origin: '*',}})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private userService: UserService) {}

  private logger: Logger = new Logger('MainChatGateway');
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.logger.log('Initialisation of Main Chat websocket');
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) 
  {
    try
    {
      const token = client.handshake.auth.token;
      this.userService.checkToken(token);
      const user = await this.userService.getUserByToken(token);
      this.userService.updateUserSocket(user, client.id);
      this.logger.log(`User: ${user.login} is connected to chat with socket ${client.id}`);
    } 
    catch (error)
    {
      this.server.to(client.id).emit('chatError', error.message);
      client.disconnect();
    }
  }
}
