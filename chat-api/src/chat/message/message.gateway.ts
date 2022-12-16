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

import { ChannelService } from '../channel/channel.service';

import { User } from 'db-interface/Core';
import { UserChannelService } from '../user-channel/user-channel.service';
import { BannedChanService } from '../banned-chan/banned-chan.service';

@UsePipes(WSPipe)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class MessageGateway
// implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 
{
  constructor(private messageService: MessageService,
    private userService: UserService,
    private channelService: ChannelService,
    private userChannelService: UserChannelService,
    private bannedChanService: BannedChanService,
  ) { }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');


  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: CreateMessageDto): Promise<void> {
    try {
      const token = client.handshake.auth.token;
      this.userService.checkToken(token);
      const sender = await this.userService.getUserByToken(token);
      const channel = await this.channelService.findOne(payload.channelId);
      const userchannels = await this.userChannelService.findByUserAndChan(sender.id, payload.channelId);

      if (userchannels.length == 0) {
        this.server.to(client.id).emit('chatError', `You are not connected to the channel ${channel.name}`);
        return;
      }

      const msgData: IMessage =
      {
        sender: sender,
        channelId: payload.channelId,
        text: payload.text
      }
      const new_message = await this.messageService.create(msgData);

      // const usersOfChannel: User[] = channel.users;
      // for (let user of usersOfChannel) 
      // {
      //    IF USER IS NOT MUTED BY CHANNEL
      //    IF SENDER IS NOT BLOCKED BY USER
      // 
      //   this.server.to(user.chatSocketId).emit(`msgToChannel`, new_message);
      // }

      this.server.emit(`msgToChannel`, new_message);
    }
    catch (error) {
      this.server.to(client.id).emit('chatError', error);
    }

  }

  // afterInit(server: Server) {
  //   this.logger.log('Initialisation of Message websocket');
  // }
  // handleDisconnect(client: Socket) {
  //   this.logger.log(`Client disconnected: ${client.id}`);
  // }
  // handleConnection(client: Socket, ...args: any[]) {
  //   this.logger.log(`Client connected: ${client.id}`);
  // }
}
