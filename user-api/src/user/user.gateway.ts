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
import { EmitInvitationsDto, ReceiveInvitationsDto } from './dto/invitations.dto';
import { MatchService } from 'src/match/match.service';


@WebSocketGateway({cors: {origin: '*',}})
export class UserGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private userService: UserService,
              private matchService: MatchService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('UserGateway');



  @SubscribeMessage('emitInvitation')
  async emitInvitation(client: Socket, payload: EmitInvitationsDto): Promise<void>
  {
    try {
      const token = client.handshake.auth.token;
      this.userService.checkToken(token);
      const emitter = await this.userService.getUserByToken(token);
      const receiver = await this.userService.getUserByLogin(payload.login);

      const sentPaylod = 
      {
        sender: emitter.login,
        gamecode: payload.gameCode
      }
      this.server.to(receiver.globalSocketId).emit('receiveInvitation', {sender: emitter.login, sentPaylod});
      
    } catch (error)
    {
      this.server.to(client.id).emit('globalError', error.message);
    }
  }


  @SubscribeMessage('acceptInvitation')
  async receiveInvitation(client: Socket, payload: ReceiveInvitationsDto): Promise<void>
  {
    try {
      const token = client.handshake.auth.token;
      this.userService.checkToken(token);
      const emitter = await this.userService.getUserByToken(token);
      
    } catch (error)
    {
      this.server.to(client.id).emit('globalError', error.message);
    }
  }

  @SubscribeMessage('receiveAcceptation')
  async receiveAcceptation(client: Socket, payload: ReceiveInvitationsDto): Promise<void>
  {
    try {
      const token = client.handshake.auth.token;
      this.userService.checkToken(token);
      const emitter = await this.userService.getUserByToken(token);
      
    } catch (error)
    {
      this.server.to(client.id).emit('globalError', error.message);
    }
  }

  async handleConnection(client: Socket, ...args: any[]) 
  {
    try {
      const token = client.handshake.auth.token;
      this.userService.checkToken(token);
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

      const matchesToRemove = await this.matchService.findCurrentUnfinishedMatchesByUser(user);
      for (let match of matchesToRemove)
      {
        this.server.to(match.playerOne.globalSocketId).emit('globalError', `match ${match.gameCode} has been canceled`);
        if (match.playerTwo)
          this.server.to(match.playerTwo.globalSocketId).emit('globalError', `match ${match.gameCode} has been canceled`);
        this.matchService.remove(match.id);
      }

    } catch (error) 
    {
      client.disconnect();
      this.logger.log(error);
    }
  
  }

  

}
