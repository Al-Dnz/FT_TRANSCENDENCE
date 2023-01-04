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
import { EmitInvitationsDto, ResponseInvitationsDto,  } from './dto/invitations.dto';
import { MatchService } from 'src/match/match.service';
import { HttpException, HttpStatus } from '@nestjs/common';

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


  @SubscribeMessage('respondToInvitation')
  async respondToInvitation(client: Socket, payload: ResponseInvitationsDto): Promise<void>
  {
    try {
      const token = client.handshake.auth.token;
      this.userService.checkToken(token);
      const responder = await this.userService.getUserByToken(token);
      const asker = await this.userService.getUserByLogin(payload.login);

      const match = await this.matchService.findByGameCode(payload.gameCode);

      // if (match.playerOne != asker || match.playerTwo != responder)
      //   throw new HttpException('One of the match players is not invited to the match', HttpStatus.NOT_FOUND);

      if (payload.accepted == true)
      {
        this.server.to(asker.globalSocketId).emit('globalMsg', `${responder.login} has accepted your invitation to play`);
        this.server.to(asker.globalSocketId).emit('receiveResponse', {accepted: payload.accepted, gameCode: payload.gameCode});
      }
      else
      {
        this.server.to(asker.globalSocketId).emit('globalError', `${responder.login} has refused your invitation to play`);
        this.matchService.removeByGameCode(payload.gameCode);
      }
    } catch (error)
    {
      this.server.to(client.id).emit('globalError', error.message);
    }
  }

  // @SubscribeMessage('receiveAcceptation')
  // async receiveAcceptation(client: Socket, payload:ResponseInvitationsDto): Promise<void>
  // {
  //   try {
  //     const token = client.handshake.auth.token;
  //     this.userService.checkToken(token);
  //     const emitter = await this.userService.getUserByToken(token);
      
  //   } catch (error)
  //   {
  //     this.server.to(client.id).emit('globalError', error.message);
  //   }
  // }

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
