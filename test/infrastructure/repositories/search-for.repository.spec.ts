import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmSearchForRepository } from '../../../src/infrastructure/repositories/search-for.repository';
import { SearchForEntity } from '../../../src/infrastructure/entities/search-for.entity';
import { UserEntity } from '../../../src/infrastructure/entities/user.entity';
import { SearchFor, SearchForType } from '../../../src/domain/entities/search-for.entity';
import { User } from '../../../src/domain/entities/user.entity';

describe('TypeOrmSearchForRepository', () => {
  let repository: TypeOrmSearchForRepository;
  let searchForRepository: jest.Mocked<Repository<SearchForEntity>>;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let mockUser: User;
  let mockUserEntity: UserEntity;
  let mockSearchFor: SearchFor;
  let mockSearchForEntity: SearchForEntity;

  beforeEach(async () => {
    // Create mock User
    mockUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: 'john.doe@example.com',
      document: '123456789',
      contact: '+1 (555) 123-4567',
      photo: 'https://example.com/photo.jpg',
      isDeleted: false,
      createdDate: new Date('2023-01-01'),
      updatedDate: new Date('2023-01-02'),
    } as User;

    // Create mock UserEntity
    mockUserEntity = new UserEntity();
    mockUserEntity.id = mockUser.id;
    mockUserEntity.name = mockUser.name;
    mockUserEntity.email = mockUser.email;
    mockUserEntity.document = mockUser.document;
    mockUserEntity.contact = mockUser.contact;
    mockUserEntity.photo = mockUser.photo;
    mockUserEntity.isDeleted = mockUser.isDeleted;
    mockUserEntity.createdDate = mockUser.createdDate;
    mockUserEntity.updatedDate = mockUser.updatedDate;

    // Mock the toDomain method of UserEntity
    jest.spyOn(mockUserEntity, 'toDomain').mockReturnValue(mockUser);

    // Create mock SearchFor
    mockSearchFor = {
      id: '456e7890-e89b-12d3-a456-426614174000',
      type: SearchForType.PERSON,
      name: 'Jane Doe',
      birthdayYear: 1990,
      lastLocation: 'Central Park, New York',
      lastSeenDateTime: new Date('2023-06-15T14:30:00Z'),
      description: 'Woman with brown hair, wearing a red jacket',
      contact: '+1 (555) 987-6543',
      recentPhoto: 'https://example.com/photos/jane.jpg',
      user: mockUser,
      isDeleted: false,
      createdDate: new Date('2023-01-01'),
      updatedDate: new Date('2023-01-02'),
    } as SearchFor;

    // Create mock SearchForEntity
    mockSearchForEntity = new SearchForEntity();
    mockSearchForEntity.id = mockSearchFor.id;
    mockSearchForEntity.type = mockSearchFor.type;
    mockSearchForEntity.name = mockSearchFor.name;
    mockSearchForEntity.birthdayYear = mockSearchFor.birthdayYear;
    mockSearchForEntity.lastLocation = mockSearchFor.lastLocation;
    mockSearchForEntity.lastSeenDateTime = mockSearchFor.lastSeenDateTime;
    mockSearchForEntity.description = mockSearchFor.description;
    mockSearchForEntity.contact = mockSearchFor.contact;
    mockSearchForEntity.recentPhoto = mockSearchFor.recentPhoto;
    mockSearchForEntity.isDeleted = mockSearchFor.isDeleted;
    mockSearchForEntity.createdDate = mockSearchFor.createdDate;
    mockSearchForEntity.updatedDate = mockSearchFor.updatedDate;
    mockSearchForEntity.user = mockUserEntity;
    mockSearchForEntity.userId = mockUserEntity.id;

    // Mock the toDomain method of SearchForEntity
    jest.spyOn(mockSearchForEntity, 'toDomain').mockReturnValue(mockSearchFor);

    // Mock the fromDomain static method of SearchForEntity
    jest.spyOn(SearchForEntity, 'fromDomain').mockReturnValue(mockSearchForEntity);

    // Create mocks for the TypeORM repositories
    searchForRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<SearchForEntity>>;

    userRepository = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<UserEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmSearchForRepository,
        {
          provide: getRepositoryToken(SearchForEntity),
          useValue: searchForRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepository,
        },
      ],
    }).compile();

    repository = module.get<TypeOrmSearchForRepository>(TypeOrmSearchForRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all non-deleted search items', async () => {
      // Arrange
      const mockSearchForEntities = [mockSearchForEntity, mockSearchForEntity];
      searchForRepository.find.mockResolvedValue(mockSearchForEntities);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(searchForRepository.find).toHaveBeenCalledWith({
        where: { isDeleted: false },
        relations: ['user'],
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(mockSearchFor);
      expect(result[1]).toBe(mockSearchFor);
      expect(mockSearchForEntity.toDomain).toHaveBeenCalledTimes(2);
    });

    it('should return an empty array when no search items exist', async () => {
      // Arrange
      searchForRepository.find.mockResolvedValue([]);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(searchForRepository.find).toHaveBeenCalledWith({
        where: { isDeleted: false },
        relations: ['user'],
      });
      expect(result).toEqual([]);
      expect(mockSearchForEntity.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a search item when found', async () => {
      // Arrange
      const searchForId = '456e7890-e89b-12d3-a456-426614174000';
      searchForRepository.findOne.mockResolvedValue(mockSearchForEntity);

      // Act
      const result = await repository.findById(searchForId);

      // Assert
      expect(searchForRepository.findOne).toHaveBeenCalledWith({
        where: { id: searchForId, isDeleted: false },
        relations: ['user'],
      });
      expect(result).toBe(mockSearchFor);
      expect(mockSearchForEntity.toDomain).toHaveBeenCalledTimes(1);
    });

    it('should return null when search item is not found', async () => {
      // Arrange
      const searchForId = '456e7890-e89b-12d3-a456-426614174000';
      searchForRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findById(searchForId);

      // Assert
      expect(searchForRepository.findOne).toHaveBeenCalledWith({
        where: { id: searchForId, isDeleted: false },
        relations: ['user'],
      });
      expect(result).toBeNull();
      expect(mockSearchForEntity.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('findByUser', () => {
    it('should return search items for a specific user', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockSearchForEntities = [mockSearchForEntity, mockSearchForEntity];
      searchForRepository.find.mockResolvedValue(mockSearchForEntities);

      // Act
      const result = await repository.findByUser(userId);

      // Assert
      expect(searchForRepository.find).toHaveBeenCalledWith({
        where: { userId, isDeleted: false },
        relations: ['user'],
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(mockSearchFor);
      expect(result[1]).toBe(mockSearchFor);
      expect(mockSearchForEntity.toDomain).toHaveBeenCalledTimes(2);
    });

    it('should return an empty array when no search items exist for the user', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      searchForRepository.find.mockResolvedValue([]);

      // Act
      const result = await repository.findByUser(userId);

      // Assert
      expect(searchForRepository.find).toHaveBeenCalledWith({
        where: { userId, isDeleted: false },
        relations: ['user'],
      });
      expect(result).toEqual([]);
      expect(mockSearchForEntity.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('findByType', () => {
    it('should return search items of a specific type', async () => {
      // Arrange
      const type = SearchForType.PERSON;
      const mockSearchForEntities = [mockSearchForEntity, mockSearchForEntity];
      searchForRepository.find.mockResolvedValue(mockSearchForEntities);

      // Act
      const result = await repository.findByType(type);

      // Assert
      expect(searchForRepository.find).toHaveBeenCalledWith({
        where: { type, isDeleted: false },
        relations: ['user'],
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(mockSearchFor);
      expect(result[1]).toBe(mockSearchFor);
      expect(mockSearchForEntity.toDomain).toHaveBeenCalledTimes(2);
    });

    it('should return an empty array when no search items exist of the type', async () => {
      // Arrange
      const type = SearchForType.ANIMAL;
      searchForRepository.find.mockResolvedValue([]);

      // Act
      const result = await repository.findByType(type);

      // Assert
      expect(searchForRepository.find).toHaveBeenCalledWith({
        where: { type, isDeleted: false },
        relations: ['user'],
      });
      expect(result).toEqual([]);
      expect(mockSearchForEntity.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save a search item and return the domain entity', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(mockUserEntity);
      searchForRepository.save.mockResolvedValue(mockSearchForEntity);
      searchForRepository.findOne.mockResolvedValue(mockSearchForEntity);

      // Act
      const result = await repository.save(mockSearchFor);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockSearchFor.user.id },
      });
      expect(SearchForEntity.fromDomain).toHaveBeenCalledWith(mockSearchFor, mockUserEntity);
      expect(searchForRepository.save).toHaveBeenCalledWith(mockSearchForEntity);
      expect(searchForRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockSearchForEntity.id },
        relations: ['user'],
      });
      expect(result).toBe(mockSearchFor);
    });

    it('should throw an error when user is not found', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(repository.save(mockSearchFor)).rejects.toThrow(
        `User with id ${mockSearchFor.user.id} not found`
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockSearchFor.user.id },
      });
      expect(searchForRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should mark a search item as deleted when found', async () => {
      // Arrange
      const searchForId = '456e7890-e89b-12d3-a456-426614174000';
      const mockDeletedSearchFor = { ...mockSearchFor, isDeleted: true } as SearchFor;
      
      // Mock the findById method to return the search item
      jest.spyOn(repository, 'findById').mockResolvedValue(mockSearchFor);
      
      // Mock the markAsDeleted method on the search item
      const markAsDeletedMock = jest.fn();
      mockSearchFor.markAsDeleted = markAsDeletedMock;
      
      // Mock the save method to return the deleted search item
      jest.spyOn(repository, 'save').mockResolvedValue(mockDeletedSearchFor);

      // Act
      await repository.delete(searchForId);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(searchForId);
      expect(markAsDeletedMock).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(mockSearchFor);
    });

    it('should do nothing when search item is not found', async () => {
      // Arrange
      const searchForId = 'nonexistent-id';
      
      // Mock the findById method to return null
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      
      // Mock the save method
      jest.spyOn(repository, 'save').mockResolvedValue(mockSearchFor);

      // Act
      await repository.delete(searchForId);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(searchForId);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});