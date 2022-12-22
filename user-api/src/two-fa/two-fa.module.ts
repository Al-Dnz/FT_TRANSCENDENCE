import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { TwoFaController } from './two-fa.controller';

@Module({

  controllers: [TwoFaController],
  imports: [MailModule]
})
export class TwoFaModule {}
