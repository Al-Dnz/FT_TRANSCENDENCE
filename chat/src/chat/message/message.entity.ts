import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
	OneToMany
   } from 'typeorm';

import { Channel } from 'src/chat/channel/channel.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Message 
{
	@PrimaryGeneratedColumn()
  	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@Column('boolean', {default: false})
	private: boolean = false;

	@Column()
	text: string;
	
	@ManyToOne(() =>User, (user) => user.messages)
	@JoinColumn({name: "sender_id"})   
    sender: User

    @ManyToOne(() =>Channel, (channel) => channel.messages)
	@JoinColumn({name: "channel_id"})   
    channel: Channel

}
