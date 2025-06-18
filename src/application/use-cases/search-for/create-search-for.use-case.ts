import { Injectable, Inject } from '@nestjs/common';
import { SearchFor, SearchForType } from '../../../domain/entities/search-for.entity';
import { SearchForRepository } from '../../../domain/ports/search-for-repository.interface';
import { SEARCH_FOR_REPOSITORY, USER_REPOSITORY } from '../../../domain/ports/injection-tokens';
import { UserRepository } from '../../../domain/ports/user-repository.interface';
import { NotFoundException } from '@nestjs/common';

export interface CreateSearchForDto {
  type: SearchForType;
  name: string;
  birthdayYear: number;
  lastLocation: string;
  lastSeenDateTime: Date;
  description: string;
  contact: string;
  userId: string;
  recentPhoto?: string | null;
}

@Injectable()
export class CreateSearchForUseCase {
  constructor(
    @Inject(SEARCH_FOR_REPOSITORY)
    private readonly searchForRepository: SearchForRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(createSearchForDto: CreateSearchForDto): Promise<SearchFor> {
    // Find the user
    const user = await this.userRepository.findById(createSearchForDto.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${createSearchForDto.userId} not found`);
    }

    // Create a new search item
    const searchFor = SearchFor.create(
      createSearchForDto.type,
      createSearchForDto.name,
      createSearchForDto.birthdayYear,
      createSearchForDto.lastLocation,
      createSearchForDto.lastSeenDateTime,
      createSearchForDto.description,
      user,
      createSearchForDto.contact,
      createSearchForDto.recentPhoto || null,
    );

    // Save and return the search item
    return this.searchForRepository.save(searchFor);
  }
}