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

import { ChannelType, User } from 'db-interface/Core';
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

      if (channel.type != ChannelType.direct)
      {
        const usersOfChannel: User[] = await this.userChannelService.getAllUsersFromChan(channel.id);
        for (let user of usersOfChannel) 
        {
          //  IF USER IS NOT MUTED BY CHANNEL
          //  IF SENDER IS NOT BLOCKED BY USER
        
          this.server.to(user.chatSocketId).emit(`msgToChannel`, new_message);
        }
      }
      else
      {
        this.server.to(channel.userOne.chatSocketId).emit(`msgToChannel`, new_message);
        this.server.to(channel.userTwo.chatSocketId).emit(`msgToChannel`, new_message);
      }
      

      // if (channel.type = ChannelType.direct)
      // {
      //   this.server.to(channel.userOne.chatSocketId).emit(`msgToChannel`, new_message);
      //   this.server.to(channel.userTwo.chatSocketId).emit(`msgToChannel`, new_message);
      // }
      // else
      // {
        // this.server.emit(`msgToChannel`, new_message);
      // }
      
    }
    catch (error) {
      this.server.to(client.id).emit('chatError', error);
    }

  }
}
