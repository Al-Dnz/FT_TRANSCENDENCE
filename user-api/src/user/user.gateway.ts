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

import { UserService } from './user.service';
import { UserStatus } from 'db-interface/Core';


@WebSocketGateway({cors: {origin: '*',}})
export class UserGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private userService: UserService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('UserGateway');

  async handleConnection(client: Socket, ...args: any[]) 
  {
    try {
      const token = client.handshake.auth.token;
      // this.userService.checkToken(token);
      const user = await this.userService.getUserByToken(token);
      this.logger.log(`User ${user.login} is connected`);
      this.userService.updateUserStatus(user, UserStatus.online, client.id)
      const payload =
      {
        login: user.login,
        status: user.status
      }
      this.server.emit('userStatus', payload);
      

    } catch (error) 
    {
      client.disconnect();
      this.logger.log(error);
    }
  }

  async handleDisconnect(client: Socket) 
  {
    try 
    {
      const user = await this.userService.getUserBySocketId(client.id);
      this.userService.updateUserStatus(user, UserStatus.offline, null)
      this.logger.log(`User ${user.login} is disconnected`);
      const payload =
      {
        login: user.login,
        status: user.status
      }
      this.server.emit('userStatus', payload);      
    } catch (error) 
    {
      client.disconnect();
      this.logger.log(error);
    }
  
  }

  

}
