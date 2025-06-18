import { SearchForResponseDto } from '../../../../src/presentation/dtos/search-for/search-for-response.dto';
import { SearchFor, SearchForType } from '../../../../src/domain/entities/search-for.entity';
import { User } from '../../../../src/domain/entities/user.entity';
import { UserResponseDto } from '../../../../src/presentation/dtos/user/user-response.dto';

describe('SearchForResponseDto', () => {
  let mockUser: User;
  let mockSearchFor: SearchFor;

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
  });


  describe('constructor', () => {
    it('should create a SearchForResponseDto from a SearchFor entity', () => {
      // Act
      const dto = new SearchForResponseDto(mockSearchFor);

      // Assert
      expect(dto).toBeDefined();
      expect(dto.id).toBe(mockSearchFor.id);
      expect(dto.type).toBe(mockSearchFor.type);
      expect(dto.name).toBe(mockSearchFor.name);
      expect(dto.birthdayYear).toBe(mockSearchFor.birthdayYear);
      expect(dto.lastLocation).toBe(mockSearchFor.lastLocation);
      expect(dto.lastSeenDateTime).toBe(mockSearchFor.lastSeenDateTime);
      expect(dto.description).toBe(mockSearchFor.description);
      expect(dto.contact).toBe(mockSearchFor.contact);
      expect(dto.recentPhoto).toBe(mockSearchFor.recentPhoto);
      expect(dto.createdDate).toBe(mockSearchFor.createdDate);
      expect(dto.updatedDate).toBe(mockSearchFor.updatedDate);
      expect(dto.user).toBeInstanceOf(UserResponseDto);
    });

    it('should handle null recentPhoto', () => {
      // Arrange
      const searchForWithNullPhoto = { ...mockSearchFor, recentPhoto: null } as SearchFor;

      // Act
      const dto = new SearchForResponseDto(searchForWithNullPhoto);

      // Assert
      expect(dto.recentPhoto).toBeNull();
    });
  });

  describe('fromEntity', () => {
    it('should create a SearchForResponseDto from a SearchFor entity', () => {
      // Act
      const dto = SearchForResponseDto.fromEntity(mockSearchFor);

      // Assert
      expect(dto).toBeDefined();
      expect(dto).toBeInstanceOf(SearchForResponseDto);
      expect(dto.id).toBe(mockSearchFor.id);
      expect(dto.type).toBe(mockSearchFor.type);
      expect(dto.name).toBe(mockSearchFor.name);
      expect(dto.birthdayYear).toBe(mockSearchFor.birthdayYear);
      expect(dto.lastLocation).toBe(mockSearchFor.lastLocation);
      expect(dto.lastSeenDateTime).toBe(mockSearchFor.lastSeenDateTime);
      expect(dto.description).toBe(mockSearchFor.description);
      expect(dto.contact).toBe(mockSearchFor.contact);
      expect(dto.recentPhoto).toBe(mockSearchFor.recentPhoto);
      expect(dto.createdDate).toBe(mockSearchFor.createdDate);
      expect(dto.updatedDate).toBe(mockSearchFor.updatedDate);
      expect(dto.user).toBeInstanceOf(UserResponseDto);
    });
  });

  describe('fromEntities', () => {
    it('should create an array of SearchForResponseDto from an array of SearchFor entities', () => {
      // Arrange
      const searchFors = [mockSearchFor, mockSearchFor];

      // Act
      const dtos = SearchForResponseDto.fromEntities(searchFors);

      // Assert
      expect(dtos).toBeDefined();
      expect(dtos).toBeInstanceOf(Array);
      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(SearchForResponseDto);
      expect(dtos[1]).toBeInstanceOf(SearchForResponseDto);
      expect(dtos[0].id).toBe(mockSearchFor.id);
      expect(dtos[1].id).toBe(mockSearchFor.id);
    });

    it('should return an empty array when given an empty array', () => {
      // Act
      const dtos = SearchForResponseDto.fromEntities([]);

      // Assert
      expect(dtos).toBeDefined();
      expect(dtos).toBeInstanceOf(Array);
      expect(dtos).toHaveLength(0);
    });
  });
});
