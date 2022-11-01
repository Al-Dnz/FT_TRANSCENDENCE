import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne
   } from 'typeorm';

import { Channel } from 'src/chat/channel/channel.entity';

@Entity()
export class Message 
{
	@PrimaryGeneratedColumn()
  	id: number;

	@Column({ unique: true })
	text: string;
	
	@CreateDateColumn()
	createdAt: Date;

	// to remove with channel table
	@Column()
	sender: string;

    @ManyToOne(() =>Channel, (channel) => channel.messages)
    channel: Channel

}
