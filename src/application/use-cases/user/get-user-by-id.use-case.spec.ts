import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';
import { UserRepository } from '../../../domain/ports/user-repository.interface';
import { USER_REPOSITORY } from '../../../domain/ports/injection-tokens';
import { User } from '../../../domain/entities/user.entity';

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;
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
        GetUserByIdUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return a user when found', async () => {
      // Arrange
      const mockUser = {} as User;
      userRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await useCase.execute(userId);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toBe(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(userId)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`)
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });
});