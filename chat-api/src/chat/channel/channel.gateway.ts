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
import { HttpException, HttpStatus } from '@nestjs/common';
import { Channel, ChannelType, User, UserChannel, UserChannelRole } from 'db-interface/Core';
import { JoinChannelDto } from './dto/join-channel.dto';
import { UserService } from '../user/user.service';
import { UserChannelService } from '../user-channel/user-channel.service';
import { CreateUserChannelDto } from '../user-channel/dto/create-user-channel.dto';
import { KickUserDto } from './dto/kick-user.dto';
import { GrantUserDto } from './dto/grant-user.dto';
import { BannedChanService } from '../banned-chan/banned-chan.service';
import { DirectMessageDto } from './dto/direct-message.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UserChannelDto } from './dto/user-channel.dto';
import { MuteUserDto } from './dto/mute-user.dto';

@UsePipes(WSPipe)
@WebSocketGateway({ cors: { origin: '*' } })
export class ChannelGateway {
	constructor(private channelService: ChannelService,
		private userService: UserService,
		private userChannelService: UserChannelService,
		private bannedChanService: BannedChanService,
	) { }
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChannelGateway');

	// private sendToNoBlockedUser(user: User, payload: any, event: string): void
	// {
	//   const userList = 
	//   this.server.emit(event, payload);
	// }


	@SubscribeMessage('createChannel')
	async createNewChan(client: any, payload: CreateChannelDto): Promise<void> {
		try {
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);
			const new_chan = await this.channelService.create(payload, user);

			const userChannelData: CreateUserChannelDto =
			{
				userId: user.id,
				channelId: new_chan.id
			}
			await this.userChannelService.create(userChannelData, UserChannelRole.owner);

			const sentPayload =
			{
				channelId: new_chan.id,
				locked: false,
				messages: [],
			}

			this.server.to(client.id).emit('currentChanToClient', {channel: new_chan});
			this.server.to(client.id).emit('allChanMessagesToClient', sentPayload);

			// if (new_chan.type != ChannelType.direct)
			this.sendAllChan(client)
		} catch (error) {
			this.server.to(client.id).emit('chatError', error.message);
		}
	}

	@SubscribeMessage('quitChannel')
	async quitChan(client: any, payload: JoinChannelDto): Promise<void> {
		try {
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);

			let userchannels = await this.userChannelService.findByUserAndChan(user.id, payload.id)
			for (let userchannel of userchannels) {
				await this.userChannelService.remove(userchannel.id);
			}

			const sentPayload =
			{
				channelId: payload.id,
				locked: true,
				messages: [],
			}

			// case for DM
			const channel = await this.channelService.findOne(payload.id);
			if (channel.type == ChannelType.direct)
			{
				userchannels = await this.userChannelService.findByChanId(channel.id)
				for (let userchannel of userchannels) {
					await this.userChannelService.remove(userchannel.id);
				}
				const userOne = channel.userOne;
				const userTwo = channel.userTwo;
				this.server.to(userOne.chatSocketId).emit('allChanMessagesToClient', sentPayload);
				this.server.to(userTwo.chatSocketId).emit('allChanMessagesToClient', sentPayload);
				const userchandatas =
				{
					channelId: channel.id,
					userchannels: {}
				}
				this.server.to(userOne.chatSocketId).emit('channelUsersToClient', userchandatas);
				this.server.to(userTwo.chatSocketId).emit('channelUsersToClient', userchandatas);

				await this.channelService.remove(payload.id);
				await this.sendAllChan(client);
				return;
			}
			
			this.server.to(client.id).emit('allChanMessagesToClient', sentPayload);
			await this.sendAllChan(client);
			await this.sendChannelUsers(client, payload);

		}
		catch (error) {
			this.server.to(client.id).emit('chatError', error.message);
		}
	}


	@SubscribeMessage('getAllChannels')
	async sendAllChan(client: Socket) {
		try {
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const all_chan = await this.channelService.findAll();
			this.server.emit('allChansToClient', all_chan);

		} catch (error) {
			this.server.to(client.id).emit('chatError', error.message);
		}
	}

	@SubscribeMessage('getChannelUsers')
	// async sendChannelUsers(client: Socket, payload: JoinChannelDto)
	async sendChannelUsers(client: Socket, payload: UserChannelDto) {
		try {
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const userchannels = await this.userChannelService.findByChanId(payload.id);
			const sentDatas =
			{
				channelId: payload.id,
				userchannels: userchannels
			}
			for (let userchan of userchannels) {
				this.server.to(userchan.user.chatSocketId).emit('channelUsersToClient', sentDatas);
			}
		}
		catch (error) {
			this.server.to(client.id).emit('chatError', error.message);
		}
	}

	@SubscribeMessage('joinChannel')
	async sendChanMessages(client: Socket, payload: JoinChannelDto) {
		try {
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);

			

			const userchannels = await this.userChannelService.findByUserAndChan(user.id, payload.id);
			if (userchannels.length == 0)
			{
				this.bannedChanService.bannedChanGuard(user.id, payload.id);
				const chan = await this.channelService.checkChanValidity(payload);
				const userChannelData: CreateUserChannelDto =
				{
					userId: user.id,
					channelId: payload.id
				}
				await this.userChannelService.create(userChannelData)
			}

			const chanMessages = await this.channelService.findMessages(payload.id)
			const sentPayload =
			{
				channelId: payload.id,
				locked: false,
				messages: chanMessages,
			}
						
			this.server.to(client.id).emit('allChanMessagesToClient', sentPayload);
			await this.sendChannelUsers(client, payload);
			await this.sendAllChan(client);
		} catch (error) {
			this.server.to(client.id).emit('allChanMessagesToClient', { channelId: payload.id, locked: true, messages: {} });
			this.server.to(client.id).emit('chatError', error.message);
		}
	}

	@SubscribeMessage('kickUser')
	async kickUserFromChan(client: Socket, payload: KickUserDto) {
		try {
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);
			if (user.id == payload.userId) 
				throw new HttpException(`You can't kick yourself`, HttpStatus.FORBIDDEN);

			const channel = await this.channelService.findOne(payload.channelId);
			if (channel.type == ChannelType.direct)
				return;
			let userChannels: UserChannel[] = await this.userChannelService.findByUserAndChan(user.id, payload.channelId);
			if (userChannels.length == 0) {
				this.server.to(client.id).emit('chatError', `you are not connected to channel ${channel.name} to use this privilege`);
				return;
			}
			let userChannel = userChannels[0];
			if (userChannel.role == UserChannelRole.member) {
				this.server.to(client.id).emit('chatError', `you have not enough rights inside channel ${channel.name} to use this privilege`);
				return;
			}
			const kickedUser = await this.userService.getUserById(payload.userId);
			const kickedUserChannels = await this.userChannelService.findByUserAndChan(kickedUser.id, payload.channelId);
			if  (kickedUserChannels.length == 0)
			{
				this.server.to(client.id).emit('chatError', `${kickedUser.login} is not in channel ${channel.name} `);
				return;
			}
			if (kickedUserChannels[0].role == UserChannelRole.owner || (kickedUserChannels[0].role == UserChannelRole.admin && userChannel.role == UserChannelRole.admin)) {
				this.server.to(client.id).emit('chatError', `you can't ban ${kickedUser.login} in ${channel.name} `);
				return;
			}
			const sentPayload =
			{
				channelId: channel.id,
				locked: true,
				messages: [],
			}

			if (kickedUserChannels.length != 0) {
				for (let kickedUserChan of kickedUserChannels) {
					// this.userChannelService.update(kickedUserChan.id);
					this.server.to(kickedUserChan.user.chatSocketId).emit('allChanMessagesToClient', sentPayload);
				}
			}
			this.bannedChanService.create(kickedUser.id, channel.id);
		
			// SEND USER CHANNEL
			await this.sendChannelUsers(client, { id: payload.channelId });
			await this.sendAllChan(client);
		}
		catch (error) {
			this.server.to(client.id).emit('chatError', error.message);
		}
	}


	@SubscribeMessage('grantUser')
	async transferPrivilegeToUser(client: Socket, payload: GrantUserDto) {
		try {
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);
			if (user.id == payload.userId) {
				this.server.to(client.id).emit('chatError', `you can't grant yourself`);
				return;
			}
			const channel = await this.channelService.findOne(payload.channelId);
			if (channel.type == ChannelType.direct)
				return;
			let userChannels: UserChannel[] = await this.userChannelService.findByUserAndChan(user.id, payload.channelId);
			if (userChannels.length == 0) {
				this.server.to(client.id).emit('chatError', `you are not connected to channel ${channel.name} to use this privilege`);
				return;
			}
			let userChannel = userChannels[0];
			if (userChannel.role == UserChannelRole.member) {
				this.server.to(client.id).emit('chatError', `you have not enough rights inside channel ${channel.name} to use this privilege`);
				return;
			}
			const grantedUser = await this.userService.getUserById(payload.userId);
			const grantedUserChannels = await this.userChannelService.findByUserAndChan(grantedUser.id, payload.channelId);
			if  (grantedUserChannels.length == 0)
			{
				this.server.to(client.id).emit('chatError', `${grantedUser.login} is not in channel ${channel.name} `);
				return;
			}
			for (let userchannel of grantedUserChannels) {
				this.userChannelService.update(userchannel.id, payload.role)
			}

			// update user status in front
			this.sendChannelUsers(client, { id: payload.channelId });
		}
		catch (error) {
			this.server.to(client.id).emit('chatError', error.message);
		}
	}

	@SubscribeMessage('directMessage')
	async createDirectMessage(client: Socket, payload: DirectMessageDto) 
	{
		try
		{
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const sender = await this.userService.getUserByToken(token);
			const receiver = await this.userService.getUserByLogin(payload.login);

			if (sender.login == receiver.login)
				throw new HttpException(`You can't DM yourself`, HttpStatus.FORBIDDEN);

			// check if channel exist as DMChannel
			const DMChannels = await this.channelService.findDMChannel(sender.id, receiver.id);
			if (DMChannels.length != 0)
			{
				this.server.to(client.id).emit('chatError', `There is already a conversation between ${sender.login} and ${receiver.login}`);
				return;
			}
			// if no create it			
			const chan = await this.channelService.createDMChannel(sender, receiver);
			// join 2 participant
			const userChannelData: CreateUserChannelDto =
			{
				userId: sender.id,
				channelId: chan.id
			}
			await this.userChannelService.create(userChannelData, UserChannelRole.member);
			userChannelData.userId = receiver.id;
			await this.userChannelService.create(userChannelData, UserChannelRole.member);

			this.sendAllChan(client);
		}
		catch (error) 
		{
			this.server.to(client.id).emit('chatError', error.message);
		}
	}

	@SubscribeMessage('muteUser')
	async muteUser(client: Socket, payload: MuteUserDto) 
	{
		try {
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const admin = await this.userService.getUserByToken(token);
			const muted = await this.userService.getUserByLogin(payload.userLogin);
			const channel = await this.channelService.findOne(payload.channelId);

			if (admin.login == muted.login)
				throw new HttpException(`You can't mute yourself`, HttpStatus.FORBIDDEN);

			const requesterUserChannels = await this.userChannelService.findByUserAndChan(admin.id, channel.id);
			if (requesterUserChannels.length == 0)
				throw new HttpException(`You are not in the channel #${channel.name} to mute somebody`, HttpStatus.FORBIDDEN);

			const mutedUserChannels = await this.userChannelService.findByUserAndChan(muted.id, channel.id);
			if  (mutedUserChannels .length == 0)
				throw new HttpException(`${muted.login} is not in channel ${channel.name} `, HttpStatus.FORBIDDEN);

			if (requesterUserChannels[0].role == UserChannelRole.member)
				throw new HttpException(`You have not enougth priviledge to (un)mute ${muted.login}`, HttpStatus.FORBIDDEN);
			
			if (requesterUserChannels[0].role == UserChannelRole.admin && (mutedUserChannels[0].role == UserChannelRole.owner || mutedUserChannels[0].role == UserChannelRole.admin ))
				throw new HttpException(`You have not enougth priviledge to (un)mute ${muted.login}`, HttpStatus.FORBIDDEN);
			
			this.userChannelService.update(mutedUserChannels[0].id, mutedUserChannels[0].role, payload.muted);
			this.sendChannelUsers(client, { id: payload.channelId });
		}
		catch (error)
		{
			this.server.to(client.id).emit('chatError', error.message);
		}

	}

	@SubscribeMessage('inviteUser')
	async inviteUser(client: Socket, payload: InviteUserDto) {
		try {
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);
			const user = await this.userService.getUserByToken(token);

			const invited = await this.userService.getUserByLogin(payload.userLogin);
			const chan = await this.channelService.findOne(payload.channelId)

			if (user.login == invited.login)
				throw new HttpException(`You can't invite yourself`, HttpStatus.FORBIDDEN);

			if (chan.type == ChannelType.direct)
				throw new HttpException(`You can't invite someone else in a direct message channel`, HttpStatus.FORBIDDEN);

			const requesterUserChannels = await this.userChannelService.findByUserAndChan(user.id, chan.id);
			if (requesterUserChannels.length == 0)
				throw new HttpException(`You are not in the channel #${chan.name} to invite somebody`, HttpStatus.FORBIDDEN);

			const userChannels = await this.userChannelService.findByUserAndChan(invited.id, chan.id);
			if (userChannels.length)
				throw new HttpException(`${invited.login} is already in the channel #${chan.name}`, HttpStatus.FORBIDDEN);

			const userchannel = await this.userChannelService.create({userId: invited.id, channelId: chan.id});

			this.sendChannelUsers(client, { id: chan.id })
			this.sendAllChan(client)
			this.server.to(client.id).emit('chatMsg', `Invitation in channel #${chan.name} sent to ${invited.login} `);
			this.server.to(invited.chatSocketId).emit('chatMsg', `You have been invited by ${user.login} in channel #${chan.name}`);

			
		}
		catch (error) {
			this.server.to(client.id).emit('chatError', error.message);
		}
	}


	@SubscribeMessage('updateChannel')
	async updateChannel(client: Socket, payload: UpdateChannelDto) {
		try {
			const token = client.handshake.auth.token;
			this.userService.checkToken(token);

			const user = await this.userService.getUserByToken(token);
			const channel = await this.channelService.findOne(payload.id);

			const userChannels = await this.userChannelService.findByUserAndChan(user.id, payload.id);
			if (userChannels[0].role == UserChannelRole.member)
				throw new HttpException(`You have not enougth privileges in channel #${channel.name} to update settings. Only owner and admin are authorized`, HttpStatus.FORBIDDEN);

			this.channelService.update(payload);
			this.server.to(client.id).emit('chatMsg', `channel ${channel.name} updated !`);
		}
		catch (error) {
			this.server.to(client.id).emit('chatError', error.message);
		}

	}



}
