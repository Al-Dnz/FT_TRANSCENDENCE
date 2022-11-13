import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'db-interface/Core';
import { Repository } from 'typeorm';
import { QueryFilterDto } from 'validation/query.dto';
import { Equal } from 'typeorm';

@Injectable()
export class MatchService {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
    ) { }

    async listByUserID(login: string, query: QueryFilterDto): Promise<Match[]> {
        return this.matchRepository.find({
            skip: query.onset,
            take: query.length,
            where: { participants: Equal(login) },
            relations: {
                participants: true,
            },
        });
    }
}
