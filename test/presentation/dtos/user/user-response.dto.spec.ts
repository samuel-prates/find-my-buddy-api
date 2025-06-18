import { UserResponseDto } from 'src/presentation/dtos/user/user-response.dto';
import { User } from 'src/domain/entities/user.entity';

describe('UserResponseDto', () => {
  let mockUser: User;

  beforeEach(() => {
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
  });

  describe('constructor', () => {
    it('should create a UserResponseDto from a User entity', () => {
      // Act
      const dto = new UserResponseDto(mockUser);

      // Assert
      expect(dto).toBeDefined();
      expect(dto.id).toBe(mockUser.id);
      expect(dto.name).toBe(mockUser.name);
      expect(dto.email).toBe(mockUser.email);
      expect(dto.document).toBe(mockUser.document);
      expect(dto.contact).toBe(mockUser.contact);
      expect(dto.photo).toBe(mockUser.photo);
      expect(dto.createdDate).toBe(mockUser.createdDate);
      expect(dto.updatedDate).toBe(mockUser.updatedDate);
    });

    it('should handle null photo', () => {
      // Arrange
      const userWithNullPhoto = { ...mockUser, photo: null } as User;

      // Act
      const dto = new UserResponseDto(userWithNullPhoto);

      // Assert
      expect(dto.photo).toBeNull();
    });
  });

  describe('fromEntity', () => {
    it('should create a UserResponseDto from a User entity', () => {
      // Act
      const dto = UserResponseDto.fromEntity(mockUser);

      // Assert
      expect(dto).toBeDefined();
      expect(dto).toBeInstanceOf(UserResponseDto);
      expect(dto.id).toBe(mockUser.id);
      expect(dto.name).toBe(mockUser.name);
      expect(dto.email).toBe(mockUser.email);
      expect(dto.document).toBe(mockUser.document);
      expect(dto.contact).toBe(mockUser.contact);
      expect(dto.photo).toBe(mockUser.photo);
      expect(dto.createdDate).toBe(mockUser.createdDate);
      expect(dto.updatedDate).toBe(mockUser.updatedDate);
    });
  });

  describe('fromEntities', () => {
    it('should create an array of UserResponseDto from an array of User entities', () => {
      // Arrange
      const users = [mockUser, mockUser];

      // Act
      const dtos = UserResponseDto.fromEntities(users);

      // Assert
      expect(dtos).toBeDefined();
      expect(dtos).toBeInstanceOf(Array);
      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(UserResponseDto);
      expect(dtos[1]).toBeInstanceOf(UserResponseDto);
      expect(dtos[0].id).toBe(mockUser.id);
      expect(dtos[1].id).toBe(mockUser.id);
    });

    it('should return an empty array when given an empty array', () => {
      // Act
      const dtos = UserResponseDto.fromEntities([]);

      // Assert
      expect(dtos).toBeDefined();
      expect(dtos).toBeInstanceOf(Array);
      expect(dtos).toHaveLength(0);
    });
  });
});
