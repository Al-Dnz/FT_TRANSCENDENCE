import { Controller } from '@nestjs/common';
import { Get, Body, Param, ValidationPipe } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';

@Controller('2fa')
export class TwoFaController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async generate2FaCode() {
    // random number
    // user.2facode updated
  }

  @Get(':email/:text')
  async sendCodeToUser(
    @Param('email') email: string,
    @Param('text') text: string,
  ) {
    try {
      // find user
      // random number
      // user.2Facode = random number
      // send user.2Facode
      this.mailService.sendMail(email, text);
    } catch (error) {}
  }
}
