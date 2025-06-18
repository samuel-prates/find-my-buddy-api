import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateUserUseCase, UpdateUserDto } from '../../../../src/application/use-cases/user/update-user.use-case';
import { UserRepository } from '../../../../src/domain/ports/user-repository.interface';
import { USER_REPOSITORY } from '../../../../src/domain/ports/injection-tokens';
import { User } from '../../../../src/domain/entities/user.entity';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let mockUser: jest.Mocked<User>;

  beforeEach(async () => {
    // Create a mock for the User entity
    mockUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'existing@example.com',
      name: 'Existing User',
      document: '123456789',
      contact: '+1 (555) 123-4567',
      photo: 'https://example.com/photo.jpg',
      updateName: jest.fn(),
      updateEmail: jest.fn(),
      updateDocument: jest.fn(),
      updateContact: jest.fn(),
      updatePhoto: jest.fn(),
    } as unknown as jest.Mocked<User>;

    // Create a mock for the UserRepository
    userRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);
      const updateUserDto: UpdateUserDto = { name: 'New Name' };

      // Act & Assert
      await expect(useCase.execute(userId, updateUserDto)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`)
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating email to one that already exists', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      const existingUser = { ...mockUser, id: 'another-id' } as unknown as User;
      userRepository.findByEmail.mockResolvedValue(existingUser);
      const updateUserDto: UpdateUserDto = { email: 'already.exists@example.com' };

      // Act & Assert
      await expect(useCase.execute(userId, updateUserDto)).rejects.toThrow(
        new ConflictException(`User with email ${updateUserDto.email} already exists`)
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(updateUserDto.email);
      expect(mockUser.updateEmail).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should update user name when provided', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      const updateUserDto: UpdateUserDto = { name: 'New Name' };

      // Act
      await useCase.execute(userId, updateUserDto);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.updateName).toHaveBeenCalledWith(updateUserDto.name);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should update user email when provided and not in use', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(mockUser);
      const updateUserDto: UpdateUserDto = { email: 'new.email@example.com' };

      // Act
      await useCase.execute(userId, updateUserDto);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(updateUserDto.email);
      expect(mockUser.updateEmail).toHaveBeenCalledWith(updateUserDto.email);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should update user document when provided', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      const updateUserDto: UpdateUserDto = { document: '987654321' };

      // Act
      await useCase.execute(userId, updateUserDto);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.updateDocument).toHaveBeenCalledWith(updateUserDto.document);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should update user contact when provided', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      const updateUserDto: UpdateUserDto = { contact: '+1 (555) 987-6543' };

      // Act
      await useCase.execute(userId, updateUserDto);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.updateContact).toHaveBeenCalledWith(updateUserDto.contact);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should update user photo when provided', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      const updateUserDto: UpdateUserDto = { photo: 'https://example.com/new-photo.jpg' };

      // Act
      await useCase.execute(userId, updateUserDto);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.updatePhoto).toHaveBeenCalledWith(updateUserDto.photo);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should update user photo to null when provided as null', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      const updateUserDto: UpdateUserDto = { photo: null };

      // Act
      await useCase.execute(userId, updateUserDto);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.updatePhoto).toHaveBeenCalledWith(null);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should update multiple user fields when provided', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(mockUser);
      const updateUserDto: UpdateUserDto = {
        name: 'New Name',
        email: 'new.email@example.com',
        document: '987654321',
        contact: '+1 (555) 987-6543',
        photo: 'https://example.com/new-photo.jpg',
      };

      // Act
      await useCase.execute(userId, updateUserDto);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(updateUserDto.email);
      expect(mockUser.updateEmail).toHaveBeenCalledWith(updateUserDto.email);
      expect(mockUser.updateName).toHaveBeenCalledWith(updateUserDto.name);
      expect(mockUser.updateDocument).toHaveBeenCalledWith(updateUserDto.document);
      expect(mockUser.updateContact).toHaveBeenCalledWith(updateUserDto.contact);
      expect(mockUser.updatePhoto).toHaveBeenCalledWith(updateUserDto.photo);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });
});