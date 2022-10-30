import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	OneToMany
   } from 'typeorm';

import { Message } from '../message/message.entity';

@Entity()
export class Channel 
{
	@PrimaryGeneratedColumn()
  	id: number;

	@Column({ unique: true })
	name: string;
	
	@CreateDateColumn()
	createdAt: Date;

	@OneToMany(() => Message, (message) => message.channel)
    messages: Message[]

}
