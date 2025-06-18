import { Injectable, Inject } from '@nestjs/common';
import { SearchFor } from '../../../domain/entities/search-for.entity';
import { SearchForRepository } from '../../../domain/ports/search-for-repository.interface';
import { SEARCH_FOR_REPOSITORY } from '../../../domain/ports/injection-tokens';

@Injectable()
export class GetAllSearchForUseCase {
  constructor(
    @Inject(SEARCH_FOR_REPOSITORY)
    private readonly searchForRepository: SearchForRepository,
  ) {}

  async execute(): Promise<SearchFor[]> {
    return this.searchForRepository.findAll();
  }
}