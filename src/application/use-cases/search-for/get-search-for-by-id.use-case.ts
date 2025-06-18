import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SearchFor } from '../../../domain/entities/search-for.entity';
import { SearchForRepository } from '../../../domain/ports/search-for-repository.interface';
import { SEARCH_FOR_REPOSITORY } from '../../../domain/ports/injection-tokens';

@Injectable()
export class GetSearchForByIdUseCase {
  constructor(
    @Inject(SEARCH_FOR_REPOSITORY)
    private readonly searchForRepository: SearchForRepository,
  ) {}

  async execute(id: string): Promise<SearchFor> {
    const searchFor = await this.searchForRepository.findById(id);
    if (!searchFor) {
      throw new NotFoundException(`Search item with ID ${id} not found`);
    }
    return searchFor;
  }
}