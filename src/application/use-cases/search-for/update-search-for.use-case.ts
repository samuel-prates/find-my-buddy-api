import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SearchFor, SearchForType } from '../../../domain/entities/search-for.entity';
import { SearchForRepository } from '../../../domain/ports/search-for-repository.interface';
import { SEARCH_FOR_REPOSITORY } from '../../../domain/ports/injection-tokens';

export interface UpdateSearchForDto {
  type?: SearchForType;
  name?: string;
  birthdayYear?: number;
  lastLocation?: string;
  lastSeenDateTime?: Date;
  description?: string;
  contact?: string;
  recentPhoto?: string | null;
}

@Injectable()
export class UpdateSearchForUseCase {
  constructor(
    @Inject(SEARCH_FOR_REPOSITORY)
    private readonly searchForRepository: SearchForRepository,
  ) {}

  async execute(id: string, updateSearchForDto: UpdateSearchForDto): Promise<SearchFor> {
    // Find the search item
    const searchFor = await this.searchForRepository.findById(id);
    if (!searchFor) {
      throw new NotFoundException(`Search item with ID ${id} not found`);
    }

    // Update fields if provided
    if (updateSearchForDto.type) {
      searchFor.updateType(updateSearchForDto.type);
    }

    if (updateSearchForDto.name) {
      searchFor.updateName(updateSearchForDto.name);
    }

    if (updateSearchForDto.birthdayYear) {
      searchFor.updateBirthdayYear(updateSearchForDto.birthdayYear);
    }

    if (updateSearchForDto.lastLocation) {
      searchFor.updateLastLocation(updateSearchForDto.lastLocation);
    }

    if (updateSearchForDto.lastSeenDateTime) {
      searchFor.updateLastSeenDateTime(updateSearchForDto.lastSeenDateTime);
    }

    if (updateSearchForDto.description) {
      searchFor.updateDescription(updateSearchForDto.description);
    }

    if (updateSearchForDto.contact) {
      searchFor.updateContact(updateSearchForDto.contact);
    }

    if ('recentPhoto' in updateSearchForDto) {
      searchFor.updateRecentPhoto(updateSearchForDto.recentPhoto ?? null);
    }

    // Save and return the updated search item
    return this.searchForRepository.save(searchFor);
  }
}
