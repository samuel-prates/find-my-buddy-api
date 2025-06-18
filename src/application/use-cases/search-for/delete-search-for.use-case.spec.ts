import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteSearchForUseCase } from './delete-search-for.use-case';
import { SearchForRepository } from '../../../domain/ports/search-for-repository.interface';
import { SEARCH_FOR_REPOSITORY } from '../../../domain/ports/injection-tokens';
import { SearchFor } from '../../../domain/entities/search-for.entity';

describe('DeleteSearchForUseCase', () => {
  let useCase: DeleteSearchForUseCase;
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
        DeleteSearchForUseCase,
        {
          provide: SEARCH_FOR_REPOSITORY,
          useValue: searchForRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteSearchForUseCase>(DeleteSearchForUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const searchForId = '123e4567-e89b-12d3-a456-426614174000';

    it('should delete a search item when found', async () => {
      // Arrange
      const mockSearchFor = {} as SearchFor;
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.delete.mockResolvedValue();

      // Act
      await useCase.execute(searchForId);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(searchForRepository.delete).toHaveBeenCalledWith(searchForId);
    });

    it('should throw NotFoundException when search item is not found', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(searchForId)).rejects.toThrow(
        new NotFoundException(`Search item with ID ${searchForId} not found`)
      );
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(searchForRepository.delete).not.toHaveBeenCalled();
    });
  });
});