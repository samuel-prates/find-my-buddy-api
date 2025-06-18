import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UpdateSearchForUseCase, UpdateSearchForDto } from './update-search-for.use-case';
import { SearchForRepository } from '../../../domain/ports/search-for-repository.interface';
import { SEARCH_FOR_REPOSITORY } from '../../../domain/ports/injection-tokens';
import { SearchFor, SearchForType } from '../../../domain/entities/search-for.entity';

describe('UpdateSearchForUseCase', () => {
  let useCase: UpdateSearchForUseCase;
  let searchForRepository: jest.Mocked<SearchForRepository>;
  let mockSearchFor: jest.Mocked<SearchFor>;

  beforeEach(async () => {
    // Create a mock for the SearchFor entity
    mockSearchFor = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      type: SearchForType.PERSON,
      name: 'Jane Doe',
      birthdayYear: 1990,
      lastLocation: 'Central Park, New York',
      lastSeenDateTime: new Date('2023-06-15T14:30:00Z'),
      description: 'Woman with brown hair, wearing a red jacket',
      contact: '+1 (555) 987-6543',
      recentPhoto: 'https://example.com/photos/jane.jpg',
      updateType: jest.fn(),
      updateName: jest.fn(),
      updateBirthdayYear: jest.fn(),
      updateLastLocation: jest.fn(),
      updateLastSeenDateTime: jest.fn(),
      updateDescription: jest.fn(),
      updateContact: jest.fn(),
      updateRecentPhoto: jest.fn(),
    } as unknown as jest.Mocked<SearchFor>;

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
        UpdateSearchForUseCase,
        {
          provide: SEARCH_FOR_REPOSITORY,
          useValue: searchForRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateSearchForUseCase>(UpdateSearchForUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const searchForId = '123e4567-e89b-12d3-a456-426614174000';

    it('should throw NotFoundException when search item is not found', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(null);
      const updateSearchForDto: UpdateSearchForDto = { name: 'New Name' };

      // Act & Assert
      await expect(useCase.execute(searchForId, updateSearchForDto)).rejects.toThrow(
        new NotFoundException(`Search item with ID ${searchForId} not found`)
      );
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(searchForRepository.save).not.toHaveBeenCalled();
    });

    it('should update search item type when provided', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      const updateSearchForDto: UpdateSearchForDto = { type: SearchForType.ANIMAL };

      // Act
      await useCase.execute(searchForId, updateSearchForDto);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(mockSearchFor.updateType).toHaveBeenCalledWith(updateSearchForDto.type);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });

    it('should update search item name when provided', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      const updateSearchForDto: UpdateSearchForDto = { name: 'New Name' };

      // Act
      await useCase.execute(searchForId, updateSearchForDto);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(mockSearchFor.updateName).toHaveBeenCalledWith(updateSearchForDto.name);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });

    it('should update search item birthdayYear when provided', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      const updateSearchForDto: UpdateSearchForDto = { birthdayYear: 1995 };

      // Act
      await useCase.execute(searchForId, updateSearchForDto);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(mockSearchFor.updateBirthdayYear).toHaveBeenCalledWith(updateSearchForDto.birthdayYear);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });

    it('should update search item lastLocation when provided', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      const updateSearchForDto: UpdateSearchForDto = { lastLocation: 'New Location' };

      // Act
      await useCase.execute(searchForId, updateSearchForDto);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(mockSearchFor.updateLastLocation).toHaveBeenCalledWith(updateSearchForDto.lastLocation);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });

    it('should update search item lastSeenDateTime when provided', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      const newDate = new Date('2023-07-15T14:30:00Z');
      const updateSearchForDto: UpdateSearchForDto = { lastSeenDateTime: newDate };

      // Act
      await useCase.execute(searchForId, updateSearchForDto);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(mockSearchFor.updateLastSeenDateTime).toHaveBeenCalledWith(updateSearchForDto.lastSeenDateTime);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });

    it('should update search item description when provided', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      const updateSearchForDto: UpdateSearchForDto = { description: 'New Description' };

      // Act
      await useCase.execute(searchForId, updateSearchForDto);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(mockSearchFor.updateDescription).toHaveBeenCalledWith(updateSearchForDto.description);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });

    it('should update search item contact when provided', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      const updateSearchForDto: UpdateSearchForDto = { contact: '+1 (555) 111-2222' };

      // Act
      await useCase.execute(searchForId, updateSearchForDto);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(mockSearchFor.updateContact).toHaveBeenCalledWith(updateSearchForDto.contact);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });

    it('should update search item recentPhoto when provided', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      const updateSearchForDto: UpdateSearchForDto = { recentPhoto: 'https://example.com/new-photo.jpg' };

      // Act
      await useCase.execute(searchForId, updateSearchForDto);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(mockSearchFor.updateRecentPhoto).toHaveBeenCalledWith(updateSearchForDto.recentPhoto);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });

    it('should update search item recentPhoto to null when provided as null', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      const updateSearchForDto: UpdateSearchForDto = { recentPhoto: null };

      // Act
      await useCase.execute(searchForId, updateSearchForDto);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(mockSearchFor.updateRecentPhoto).toHaveBeenCalledWith(null);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });

    it('should update multiple search item fields when provided', async () => {
      // Arrange
      searchForRepository.findById.mockResolvedValue(mockSearchFor);
      searchForRepository.save.mockResolvedValue(mockSearchFor);
      const updateSearchForDto: UpdateSearchForDto = {
        type: SearchForType.ANIMAL,
        name: 'New Name',
        birthdayYear: 1995,
        lastLocation: 'New Location',
        lastSeenDateTime: new Date('2023-07-15T14:30:00Z'),
        description: 'New Description',
        contact: '+1 (555) 111-2222',
        recentPhoto: 'https://example.com/new-photo.jpg',
      };

      // Act
      await useCase.execute(searchForId, updateSearchForDto);

      // Assert
      expect(searchForRepository.findById).toHaveBeenCalledWith(searchForId);
      expect(mockSearchFor.updateType).toHaveBeenCalledWith(updateSearchForDto.type);
      expect(mockSearchFor.updateName).toHaveBeenCalledWith(updateSearchForDto.name);
      expect(mockSearchFor.updateBirthdayYear).toHaveBeenCalledWith(updateSearchForDto.birthdayYear);
      expect(mockSearchFor.updateLastLocation).toHaveBeenCalledWith(updateSearchForDto.lastLocation);
      expect(mockSearchFor.updateLastSeenDateTime).toHaveBeenCalledWith(updateSearchForDto.lastSeenDateTime);
      expect(mockSearchFor.updateDescription).toHaveBeenCalledWith(updateSearchForDto.description);
      expect(mockSearchFor.updateContact).toHaveBeenCalledWith(updateSearchForDto.contact);
      expect(mockSearchFor.updateRecentPhoto).toHaveBeenCalledWith(updateSearchForDto.recentPhoto);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchFor);
    });
  });
});