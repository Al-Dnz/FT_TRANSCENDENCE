/**
 * Response body
 * */

import { UserStatus } from 'db-interface/src/entity/Core';

export class UserAvatar {
  id: number;
  path: string;
}

export class UserStats {
  id: number;
  level: number;
  victories: number;
  defeats: number;
}

export class UserOutput {
  id: number;
  actual_avatar: UserAvatar;
  username: string;
  two_fa: boolean;
  status: UserStatus;
  stats: UserStats;
}

export class CreateUserInput {
  username: string;
}

export class UpdateUserInput {
  two_fa: boolean;
  username: string;
}

export class UserMatch {
  user: UserOutput;
  score: number;
}

export class MatchHistoryOutput {
  id: number;
  created_at: Date;
  finished_at: Date;
  winner: UserMatch;
  Looser: UserMatch;
}
