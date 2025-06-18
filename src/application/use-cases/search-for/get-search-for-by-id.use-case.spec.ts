import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetSearchForByIdUseCase } from './get-search-for-by-id.use-case';
import { SearchForRepository } from '../../../domain/ports/search-for-repository.interface';
import { SEARCH_FOR_REPOSITORY } from '../../../domain/ports/injection-tokens';
import { SearchFor } from '../../../domain/entities/search-for.entity';

describe('GetSearchForByIdUseCase', () => {
  let useCase: GetSearchForByIdUseCase;
  let searchForRepository: jest.Mocked<SearchForRepository>;

  beforeEach(async () => {
    // Create a mock for the SearchForRepository
    searchForRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
      findByType: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSearchForByIdUseCase,
        {
          provide: SEARCH_FOR_REPOSITORY,
          useValue: searchForRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetSearchForByIdUseCase>(GetSearchForByIdUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const searchForId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return a search item when found', async () => {
      // Arrange
      const mockSearchFor = {} as SearchFor;
      searchForRepository.findById.mockResolvedValue(mockSearchFor);

      // Act
      const result = await useCase.execute(searchForId);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(result).toBe(mockSearchFor);
    });

    it('should throw NotFoundException when search item is not found', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(searchForId)).rejects.toThrow(
        new NotFoundException(`Search item with ID ${searchForId} not found`)
      );
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
    });
  });
});