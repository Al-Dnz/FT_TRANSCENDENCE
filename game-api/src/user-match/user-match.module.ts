import { Module } from '@nestjs/common';
import { UserMatchService } from './user-match.service';

@Module({
  providers: [UserMatchService],
  exports: [UserMatchService]
})
export class UserMatchModule {}
