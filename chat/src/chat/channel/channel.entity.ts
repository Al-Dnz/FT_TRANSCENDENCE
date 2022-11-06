import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	ManyToMany,
	OneToMany,
	JoinTable,
	ManyToOne,
   } from 'typeorm';

import { Message } from '../message/message.entity';

import { User } from 'src/user/user.entity';

@Entity()
export class Channel 
{
	@PrimaryGeneratedColumn()
  	id: number;

	@Column({ unique: true })
	name: string;
	
	@CreateDateColumn()
	createdAt: Date;

	@Column('boolean', {default: false})
	unremovable: boolean = false;

	@OneToMany(() => Message, (message) => message.channel)
    messages: Message[]
	
    @ManyToMany(() => User, (user) => user.channels)
    @JoinTable({
			name: 'channel_user',
			joinColumn: 
			{
				name: 'channel_id',
				referencedColumnName: 'id',
    		},
			inverseJoinColumn: 
			{
				name: 'user_id',
				referencedColumnName: 'id',
   			},
	})
    users: User[]

}
