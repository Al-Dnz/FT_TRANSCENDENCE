import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from 'db-interface/Core';

import { Logger } from '@nestjs/common';

@Injectable()
export class AppService implements OnApplicationBootstrap
{
	constructor(
		@InjectRepository(Channel)
		private readonly channelsRepository: Repository<Channel>,
	  ) {}

	private logger: Logger = new Logger('onApplicationBootstrap');
	
	async onApplicationBootstrap()
	{
		this.logger.log(`Creation of main_chan`);
		let chan = await this.channelsRepository.findOne({ where: {name: "main_chan"} })
		if (!chan)
		{
			const channel = new Channel();
			channel.id = 1;
			channel.name = "main_chan";
			channel.unremovable = true;
			this.channelsRepository.save(channel);
		}
	}

  getHello(): string {
    return 'Welcome on FT_TRANSCENDENCE 42 project: chat service';
  }


  
	
}
