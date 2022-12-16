import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';

import { Logger } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

import { BannedChan, Channel, Message, User } from 'db-interface/Core';


@Injectable()
export class BannedChanService {
	constructor(
		@InjectRepository(BannedChan)
		private readonly bannedChansRepository: Repository<BannedChan>,
		@InjectRepository(Channel)
		private readonly channelsRepository: Repository<Channel>,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) { }

	async create(userId: number, channelId: number) {

		const channel = await this.channelsRepository.findOneBy({ id: channelId });
		if (!channel)
			throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
		const user = await this.usersRepository.findOneBy({ id: userId });
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);

		const bannedChans = await this.bannedChansRepository.find(
			{
				relations: {
					channel: true,
					user: true,
				},
				where: {
					channel: {
						id: channelId,
					},
					user: {
						id: userId,
					},
				},
			})
		if(bannedChans.length != 0)
			throw new HttpException(`user ${bannedChans[0].user.login} is already ban fron ${bannedChans[0].channel.name} until ${bannedChans[0].expirationDate}`
				, HttpStatus.FORBIDDEN);
		let bannedChan = new BannedChan;
		bannedChan.channel = channel;
		bannedChan.user = user;
		this.bannedChansRepository.save(bannedChan);
	}


	async findByUserAndChan(userId: number, chanId: number) {
		const user = await this.usersRepository.findOneBy({ id: userId });
		if (!user)
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		const channel = await this.channelsRepository.findOneBy({ id: chanId });
		if (!channel)
			throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

		const bannedChans = await this.bannedChansRepository.find(
			{
				relations: {
					channel: true,
					user: true,
				},
				where: {
					channel: {
						id: chanId,
					},
					user: {
						id: userId,
					},
				},
			})
		return bannedChans;
	}

	async isExpiredBanForUserInChan?(userId: number, chanId: number): Promise<boolean> {
		const user = await this.usersRepository.findOneBy({ id: userId });
		if (!user)
			return false;
		const channel = await this.channelsRepository.findOneBy({ id: chanId });
		if (!channel)
			return false;
		const bannedChans = await this.bannedChansRepository.find(
			{
				relations: {
					channel: true,
					user: true,
				},
				where: {
					channel: {
						id: chanId,
					},
					user: {
						id: userId,
					},
				},
			})
		if (bannedChans.length == 0)
			return false;
		const bannedChan = bannedChans[0];
		if (bannedChan.expirationDate != null)
			return false;
		if (Date.parse(bannedChan.expirationDate) < Date.now())
			return false;
		return true;
	}

	async isExpiredBan?(bannedUserId: number): Promise<boolean> {
		const bannedChan = await this.bannedChansRepository.findOneBy({ id: bannedUserId });
		if (!bannedChan)
			return false;
		if (Date.parse(bannedChan.expirationDate) < Date.now())
			return false;
		return true;
	}

	async bannedChanGuard(userId: number, chanId: number) {
		const bannedChans = await this.findByUserAndChan(userId, chanId);
		if (bannedChans.length == 0)
			return;
		const bannedChan = bannedChans[0];
		if (!bannedChan.expirationDate)
			return;
		if (Date.parse(bannedChan.expirationDate) < Date.now())
			throw new HttpException(`user ${bannedChan.user.login} is ban fron ${bannedChan.channel.name} until ${bannedChan.expirationDate}`
				, HttpStatus.FORBIDDEN);
		else
			this.remove(bannedChan.id);
	}

	async remove(id: number) {
		const bannedChannel = await this.bannedChansRepository.findOneBy({ id: id })
		if (!bannedChannel)
			throw new HttpException('bannedChannel not found', HttpStatus.NOT_FOUND);
		this.bannedChansRepository.delete(id);
	}




}
