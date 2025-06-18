import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/presentation/controllers/user.controller';
import { CreateUserUseCase } from '../../../src/application/use-cases/user/create-user.use-case';
import { GetAllUsersUseCase } from '../../../src/application/use-cases/user/get-all-users.use-case';
import { GetUserByIdUseCase } from '../../../src/application/use-cases/user/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../../src/application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../../src/application/use-cases/user/delete-user.use-case';
import { CreateUserDto } from '../../../src/presentation/dtos/user/create-user.dto';
import { UpdateUserDto } from '../../../src/presentation/dtos/user/update-user.dto';
import { UserResponseDto } from '../../../src/presentation/dtos/user/user-response.dto';
import { User } from '../../../src/domain/entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let getAllUsersUseCase: jest.Mocked<GetAllUsersUseCase>;
  let getUserByIdUseCase: jest.Mocked<GetUserByIdUseCase>;
  let updateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let deleteUserUseCase: jest.Mocked<DeleteUserUseCase>;
  let mockUser: User;

  beforeEach(async () => {
    // Create mock data
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

    // Create mocks for the use cases
    createUserUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateUserUseCase>;

    getAllUsersUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetAllUsersUseCase>;

    getUserByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetUserByIdUseCase>;

    updateUserUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateUserUseCase>;

    deleteUserUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeleteUserUseCase>;

    // Mock the static methods of UserResponseDto
    jest.spyOn(UserResponseDto, 'fromEntity').mockImplementation((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        document: user.document,
        contact: user.contact,
        photo: user.photo,
        createdDate: user.createdDate,
        updatedDate: user.updatedDate,
      } as UserResponseDto;
    });

    jest.spyOn(UserResponseDto, 'fromEntities').mockImplementation((users) => {
      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        document: user.document,
        contact: user.contact,
        photo: user.photo,
        createdDate: user.createdDate,
        updatedDate: user.updatedDate,
      } as UserResponseDto));
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: CreateUserUseCase, useValue: createUserUseCase },
        { provide: GetAllUsersUseCase, useValue: getAllUsersUseCase },
        { provide: GetUserByIdUseCase, useValue: getUserByIdUseCase },
        { provide: UpdateUserUseCase, useValue: updateUserUseCase },
        { provide: DeleteUserUseCase, useValue: deleteUserUseCase },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and return a UserResponseDto', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        document: '123456789',
        contact: '+1 (555) 123-4567',
        photo: 'https://example.com/photo.jpg',
      };
      createUserUseCase.execute.mockResolvedValue(mockUser);

      // Act
      const result = await controller.createUser(createUserDto);

      // Assert
      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
      expect(UserResponseDto.fromEntity).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        document: mockUser.document,
        contact: mockUser.contact,
        photo: mockUser.photo,
        createdDate: mockUser.createdDate,
        updatedDate: mockUser.updatedDate,
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of UserResponseDto', async () => {
      // Arrange
      const mockUsers = [mockUser, mockUser];
      getAllUsersUseCase.execute.mockResolvedValue(mockUsers);

      // Act
      const result = await controller.getAllUsers();

      // Assert
      expect(getAllUsersUseCase.execute).toHaveBeenCalled();
      expect(UserResponseDto.fromEntities).toHaveBeenCalledWith(mockUsers);
      expect(result).toEqual([
        {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          document: mockUser.document,
          contact: mockUser.contact,
          photo: mockUser.photo,
          createdDate: mockUser.createdDate,
          updatedDate: mockUser.updatedDate,
        },
        {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          document: mockUser.document,
          contact: mockUser.contact,
          photo: mockUser.photo,
          createdDate: mockUser.createdDate,
          updatedDate: mockUser.updatedDate,
        },
      ]);
    });

    it('should return an empty array when no users exist', async () => {
      // Arrange
      const mockUsers: User[] = [];
      getAllUsersUseCase.execute.mockResolvedValue(mockUsers);

      // Act
      const result = await controller.getAllUsers();

      // Assert
      expect(getAllUsersUseCase.execute).toHaveBeenCalled();
      expect(UserResponseDto.fromEntities).toHaveBeenCalledWith(mockUsers);
      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return a UserResponseDto for the specified ID', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      getUserByIdUseCase.execute.mockResolvedValue(mockUser);

      // Act
      const result = await controller.getUserById(userId);

      // Assert
      expect(getUserByIdUseCase.execute).toHaveBeenCalledWith(userId);
      expect(UserResponseDto.fromEntity).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        document: mockUser.document,
        contact: mockUser.contact,
        photo: mockUser.photo,
        createdDate: mockUser.createdDate,
        updatedDate: mockUser.updatedDate,
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user and return a UserResponseDto', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateUserDto: UpdateUserDto = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      };
      const updatedUser = { 
        ...mockUser, 
        name: 'Jane Doe', 
        email: 'jane.doe@example.com' 
      } as User;
      updateUserUseCase.execute.mockResolvedValue(updatedUser);

      // Act
      const result = await controller.updateUser(userId, updateUserDto);

      // Assert
      expect(updateUserUseCase.execute).toHaveBeenCalledWith(userId, updateUserDto);
      expect(UserResponseDto.fromEntity).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        document: updatedUser.document,
        contact: updatedUser.contact,
        photo: updatedUser.photo,
        createdDate: updatedUser.createdDate,
        updatedDate: updatedUser.updatedDate,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      deleteUserUseCase.execute.mockResolvedValue(undefined);

      // Act
      await controller.deleteUser(userId);

      // Assert
      expect(deleteUserUseCase.execute).toHaveBeenCalledWith(userId);
    });
  });
});
