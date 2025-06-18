import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmUserRepository } from '../../../src/infrastructure/repositories/user.repository';
import { UserEntity } from '../../../src/infrastructure/entities/user.entity';
import { User } from '../../../src/domain/entities/user.entity';

describe('TypeOrmUserRepository', () => {
  let repository: TypeOrmUserRepository;
  let typeOrmRepository: jest.Mocked<Repository<UserEntity>>;
  let mockUser: User;
  let mockUserEntity: UserEntity;

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

    // Mock the fromDomain static method of UserEntity
    jest.spyOn(UserEntity, 'fromDomain').mockReturnValue(mockUserEntity);

    // Create a mock for the TypeORM repository
    typeOrmRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<UserEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmUserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: typeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<TypeOrmUserRepository>(TypeOrmUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all non-deleted users', async () => {
      // Arrange
      const mockUserEntities = [mockUserEntity, mockUserEntity];
      typeOrmRepository.find.mockResolvedValue(mockUserEntities);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { isDeleted: false },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(mockUser);
      expect(result[1]).toBe(mockUser);
      expect(mockUserEntity.toDomain).toHaveBeenCalledTimes(2);
    });

    it('should return an empty array when no users exist', async () => {
      // Arrange
      typeOrmRepository.find.mockResolvedValue([]);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { isDeleted: false },
      });
      expect(result).toEqual([]);
      expect(mockUserEntity.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      typeOrmRepository.findOne.mockResolvedValue(mockUserEntity);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
      });
      expect(result).toBe(mockUser);
      expect(mockUserEntity.toDomain).toHaveBeenCalledTimes(1);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      typeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findById(userId);

      // Assert
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId, isDeleted: false },
      });
      expect(result).toBeNull();
      expect(mockUserEntity.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      // Arrange
      const email = 'john.doe@example.com';
      typeOrmRepository.findOne.mockResolvedValue(mockUserEntity);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email, isDeleted: false },
      });
      expect(result).toBe(mockUser);
      expect(mockUserEntity.toDomain).toHaveBeenCalledTimes(1);
    });

    it('should return null when user is not found by email', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      typeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email, isDeleted: false },
      });
      expect(result).toBeNull();
      expect(mockUserEntity.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save a user and return the domain entity', async () => {
      // Arrange
      typeOrmRepository.save.mockResolvedValue(mockUserEntity);

      // Act
      const result = await repository.save(mockUser);

      // Assert
      expect(UserEntity.fromDomain).toHaveBeenCalledWith(mockUser);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockUserEntity);
      expect(result).toBe(mockUser);
      expect(mockUserEntity.toDomain).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should mark a user as deleted when found', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockDeletedUser = { ...mockUser, isDeleted: true } as User;
      
      // Mock the findById method to return the user
      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser);
      
      // Mock the markAsDeleted method on the user
      const markAsDeletedMock = jest.fn();
      mockUser.markAsDeleted = markAsDeletedMock;
      
      // Mock the save method to return the deleted user
      jest.spyOn(repository, 'save').mockResolvedValue(mockDeletedUser);

      // Act
      await repository.delete(userId);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(userId);
      expect(markAsDeletedMock).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should do nothing when user is not found', async () => {
      // Arrange
      const userId = 'nonexistent-id';
      
      // Mock the findById method to return null
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      
      // Mock the save method
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

      // Act
      await repository.delete(userId);

      // Assert
      expect(repository.findById).toHaveBeenCalledWith(userId);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});