import { Test, TestingModule } from '@nestjs/testing';
import { UserMatchService } from './user-match.service';

describe('UserMatchService', () => {
  let service: UserMatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMatchService],
    }).compile();

    service = module.get<UserMatchService>(UserMatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
