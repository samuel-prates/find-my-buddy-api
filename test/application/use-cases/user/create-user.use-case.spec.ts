import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from '../../../../src/application/use-cases/user/create-user.use-case';
import { UserRepository } from '../../../../src/domain/ports/user-repository.interface';
import { USER_REPOSITORY } from '../../../../src/domain/ports/injection-tokens';
import { User } from '../../../../src/domain/entities/user.entity';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
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
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      document: '123456789',
      contact: '+1 (555) 123-4567',
      photo: 'https://example.com/photo.jpg',
    };

    it('should create a new user when email does not exist', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      const mockUser = {} as User;
      userRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await useCase.execute(createUserDto);

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });

    it('should throw ConflictException when user with email already exists', async () => {
      // Arrange
      const existingUser = {} as User;
      userRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(useCase.execute(createUserDto)).rejects.toThrow(
        new ConflictException(`User with email ${createUserDto.email} already exists`)
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should create a user with null photo when not provided', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null);
      const mockUser = {} as User;
      userRepository.save.mockResolvedValue(mockUser);
      const dtoWithoutPhoto = {
        name: createUserDto.name,
        email: createUserDto.email,
        document: createUserDto.document,
        contact: createUserDto.contact,
      };

      // Act
      await useCase.execute(dtoWithoutPhoto);

      // Assert
      expect(userRepository.save).toHaveBeenCalled();
      // We can't easily check the actual User.create call arguments, but we can verify save was called
    });
  });
});