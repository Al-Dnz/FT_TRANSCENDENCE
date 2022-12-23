import { Controller } from '@nestjs/common';
import { Post, Get, Body, Param, ValidationPipe } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'user-api/user.service';
import {  SendMailDto, VerifyTwoFaCodeDto } from './dto/two-fa.dto'

@Controller('2fa')
export class TwoFaController {
  constructor(
    private readonly mailService: MailService,
    private userService: UserService,
  ) {}

  @Get()
  async verify2FaCode(@Body() body: VerifyTwoFaCodeDto)
  {
    try 
	{
		const token = body.token;
		this.userService.checkToken(token);
		const user = await this.userService.getUserByToken(token);
		if (!user.twoFa)
		return;

		const isValidated: boolean = user.twoFaCode != body.code;
		this.userService.updateTwoFaCode(user, null);

		if (!isValidated)
			throw new HttpException('2Fa code is wrong', HttpStatus.FORBIDDEN);

	} 
	catch (error) 
	{
		return error;
	}
  }

  @Post()
  async sendCodeToUser(@Body() body: SendMailDto) 
  {
    try 
	{
      const token = body.token;
      this.userService.checkToken(token);
      const user = await this.userService.getUserByToken(token);
     
	  if (!user.twoFa)
		return;

	const randomNumber = Math.floor(100000 + Math.random() * 900000);
      this.userService.updateTwoFaCode(user, `${randomNumber}`);
	  let email = null;
	  if (user.login == "nschmitt")
		email = `adenhez@student.42.fr`;
	  else
	  	email = `${user.login}@student.42.fr`;
      
    //   await this.mailService.sendMail(email, user.twoFacode);
    } 
	catch (error) 
	{
		return error;
	}
  }
}
