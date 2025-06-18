import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CreateSearchForUseCase, CreateSearchForDto } from '../../../../src/application/use-cases/search-for/create-search-for.use-case';
import { SearchForRepository } from '../../../../src/domain/ports/search-for-repository.interface';
import { UserRepository } from '../../../../src/domain/ports/user-repository.interface';
import { SEARCH_FOR_REPOSITORY, USER_REPOSITORY } from '../../../../src/domain/ports/injection-tokens';
import { SearchFor, SearchForType } from '../../../../src/domain/entities/search-for.entity';
import { User } from '../../../../src/domain/entities/user.entity';

describe('CreateSearchForUseCase', () => {
  let useCase: CreateSearchForUseCase;
  let searchForRepository: jest.Mocked<SearchForRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    // Create mocks for the repositories
    searchForRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
      findByType: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    userRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSearchForUseCase,
        {
          provide: SEARCH_FOR_REPOSITORY,
          useValue: searchForRepository,
        },
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateSearchForUseCase>(CreateSearchForUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const createSearchForDto: CreateSearchForDto = {
      type: SearchForType.PERSON,
      name: 'Jane Doe',
      birthdayYear: 1990,
      lastLocation: 'Central Park, New York',
      lastSeenDateTime: new Date('2023-06-15T14:30:00Z'),
      description: 'Woman with brown hair, wearing a red jacket',
      contact: '+1 (555) 987-6543',
      userId: userId,
      recentPhoto: 'https://example.com/photos/jane.jpg',
    };

    it('should create a new search item when user exists', async () => {
      // Arrange
      const mockUser = {} as User;
      userRepository.findById.mockResolvedValue(mockUser);
      
      const mockSearchFor = {} as SearchFor;
      // Mock the static create method of SearchFor
      jest.spyOn(SearchFor, 'create').mockReturnValue(mockSearchFor);
      
      searchForRepository.save.mockResolvedValue(mockSearchFor);

      // Act
      const result = await useCase.execute(createSearchForDto);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(SearchFor.create).toHaveBeenCalledWith(
        createSearchForDto.type,
        createSearchForDto.name,
        createSearchForDto.birthdayYear,
        createSearchForDto.lastLocation,
        createSearchForDto.lastSeenDateTime,
        createSearchForDto.description,
        mockUser,
        createSearchForDto.contact,
        createSearchForDto.recentPhoto,
      );
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
      expect(result).toBe(mockSearchFor);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(createSearchForDto)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`)
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(searchForRepository.save).not.toHaveBeenCalled();
    });

    it('should create a search item with null recentPhoto when not provided', async () => {
      // Arrange
      const mockUser = {} as User;
      userRepository.findById.mockResolvedValue(mockUser);
      
      const mockSearchFor = {} as SearchFor;
      jest.spyOn(SearchFor, 'create').mockReturnValue(mockSearchFor);
      
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      
      const dtoWithoutPhoto = {
        ...createSearchForDto,
        recentPhoto: undefined,
      };

      // Act
      await useCase.execute(dtoWithoutPhoto);

      // Assert
      expect(SearchFor.create).toHaveBeenCalledWith(
        dtoWithoutPhoto.type,
        dtoWithoutPhoto.name,
        dtoWithoutPhoto.birthdayYear,
        dtoWithoutPhoto.lastLocation,
        dtoWithoutPhoto.lastSeenDateTime,
        dtoWithoutPhoto.description,
        mockUser,
        dtoWithoutPhoto.contact,
        null,
      );
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });
  });
});