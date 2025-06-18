import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from '../../../../src/application/use-cases/user/delete-user.use-case';
import { UserRepository } from '../../../../src/domain/ports/user-repository.interface';
import { USER_REPOSITORY } from '../../../../src/domain/ports/injection-tokens';
import { User } from '../../../../src/domain/entities/user.entity';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
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
        DeleteUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    it('should delete a user when found', async () => {
      // Arrange
      const mockUser = {} as User;
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.delete.mockResolvedValue();

      // Act
      await useCase.execute(userId);

      // Assert
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(userId)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`)
      );
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(userRepository.delete).not.toHaveBeenCalled();
    });
  });
});