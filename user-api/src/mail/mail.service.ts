import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(email: string, text: string) {
    console.log(email);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your FT_TRANSCENDENCE 2FA code',
      html: `<b>${text}</b>`,
    //   template: '/email',
    //   context: {
    //     name: name,
    //   },
    });
  }
}
