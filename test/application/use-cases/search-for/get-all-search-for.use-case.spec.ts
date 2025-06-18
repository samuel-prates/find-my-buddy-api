import { Test, TestingModule } from '@nestjs/testing';
import { GetAllSearchForUseCase } from '../../../../src/application/use-cases/search-for/get-all-search-for.use-case';
import { SearchForRepository } from '../../../../src/domain/ports/search-for-repository.interface';
import { SEARCH_FOR_REPOSITORY } from '../../../../src/domain/ports/injection-tokens';
import { SearchFor, SearchForType } from '../../../../src/domain/entities/search-for.entity';

describe('GetAllSearchForUseCase', () => {
  let useCase: GetAllSearchForUseCase;
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
        GetAllSearchForUseCase,
        {
          provide: SEARCH_FOR_REPOSITORY,
          useValue: searchForRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllSearchForUseCase>(GetAllSearchForUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all search items', async () => {
      // Arrange
      const mockSearchItems = [{} as SearchFor, {} as SearchFor];
      searchForRepository.findAll.mockResolvedValue(mockSearchItems);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(searchForRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(mockSearchItems);
    });

    it('should return an empty array when no search items exist', async () => {
      // Arrange
      const mockSearchItems: SearchFor[] = [];
      searchForRepository.findAll.mockResolvedValue(mockSearchItems);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(searchForRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});