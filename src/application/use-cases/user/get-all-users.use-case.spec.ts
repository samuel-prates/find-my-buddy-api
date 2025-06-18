import { Test, TestingModule } from '@nestjs/testing';
import { GetAllUsersUseCase } from './get-all-users.use-case';
import { UserRepository } from '../../../domain/ports/user-repository.interface';
import { USER_REPOSITORY } from '../../../domain/ports/injection-tokens';
import { User } from '../../../domain/entities/user.entity';

describe('GetAllUsersUseCase', () => {
  let useCase: GetAllUsersUseCase;
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
        GetAllUsersUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllUsersUseCase>(GetAllUsersUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return all users', async () => {
      // Arrange
      const mockUsers = [{} as User, {} as User];
      userRepository.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toBe(mockUsers);
    });

    it('should return an empty array when no users exist', async () => {
      // Arrange
      const mockUsers: User[] = [];
      userRepository.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});