import { SearchForEntity } from '../../../src/infrastructure/entities/search-for.entity';
import { UserEntity } from '../../../src/infrastructure/entities/user.entity';
import { SearchFor, SearchForType } from '../../../src/domain/entities/search-for.entity';
import { User } from '../../../src/domain/entities/user.entity';

describe('SearchForEntity', () => {
  let mockUser: User;
  let mockUserEntity: UserEntity;
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fromDomain', () => {
    it('should convert a domain SearchFor to a SearchForEntity with provided UserEntity', () => {
      // Act
      const entity = SearchForEntity.fromDomain(mockSearchFor, mockUserEntity);

      // Assert
      expect(entity).toBeDefined();
      expect(entity).toBeInstanceOf(SearchForEntity);
      expect(entity.id).toBe(mockSearchFor.id);
      expect(entity.type).toBe(mockSearchFor.type);
      expect(entity.name).toBe(mockSearchFor.name);
      expect(entity.birthdayYear).toBe(mockSearchFor.birthdayYear);
      expect(entity.lastLocation).toBe(mockSearchFor.lastLocation);
      expect(entity.lastSeenDateTime).toBe(mockSearchFor.lastSeenDateTime);
      expect(entity.description).toBe(mockSearchFor.description);
      expect(entity.contact).toBe(mockSearchFor.contact);
      expect(entity.recentPhoto).toBe(mockSearchFor.recentPhoto);
      expect(entity.isDeleted).toBe(mockSearchFor.isDeleted);
      expect(entity.createdDate).toBe(mockSearchFor.createdDate);
      expect(entity.updatedDate).toBe(mockSearchFor.updatedDate);
      expect(entity.user).toBe(mockUserEntity);
      expect(entity.userId).toBe(mockUserEntity.id);
    });

    it('should convert a domain SearchFor to a SearchForEntity without UserEntity', () => {
      // Act
      const entity = SearchForEntity.fromDomain(mockSearchFor);

      // Assert
      expect(entity).toBeDefined();
      expect(entity).toBeInstanceOf(SearchForEntity);
      expect(entity.id).toBe(mockSearchFor.id);
      expect(entity.type).toBe(mockSearchFor.type);
      expect(entity.name).toBe(mockSearchFor.name);
      expect(entity.birthdayYear).toBe(mockSearchFor.birthdayYear);
      expect(entity.lastLocation).toBe(mockSearchFor.lastLocation);
      expect(entity.lastSeenDateTime).toBe(mockSearchFor.lastSeenDateTime);
      expect(entity.description).toBe(mockSearchFor.description);
      expect(entity.contact).toBe(mockSearchFor.contact);
      expect(entity.recentPhoto).toBe(mockSearchFor.recentPhoto);
      expect(entity.isDeleted).toBe(mockSearchFor.isDeleted);
      expect(entity.createdDate).toBe(mockSearchFor.createdDate);
      expect(entity.updatedDate).toBe(mockSearchFor.updatedDate);
      expect(entity.user).toBeUndefined();
      expect(entity.userId).toBe(mockSearchFor.user.id);
    });

    it('should handle null recentPhoto', () => {
      // Arrange
      // Create a deep copy of mockSearchFor
      const searchForWithNullPhoto = Object.assign(
        Object.create(Object.getPrototypeOf(mockSearchFor)),
        JSON.parse(JSON.stringify(mockSearchFor))
      );
      searchForWithNullPhoto.recentPhoto = null;

      // Act
      const entity = SearchForEntity.fromDomain(searchForWithNullPhoto, mockUserEntity);

      // Assert
      expect(entity.recentPhoto).toBeNull();
    });
  });

  describe('toDomain', () => {
    it('should convert a SearchForEntity to a domain SearchFor using the entity\'s user', () => {
      // Arrange
      const entity = new SearchForEntity();
      entity.id = '456e7890-e89b-12d3-a456-426614174000';
      entity.type = SearchForType.PERSON;
      entity.name = 'Jane Doe';
      entity.birthdayYear = 1990;
      entity.lastLocation = 'Central Park, New York';
      entity.lastSeenDateTime = new Date('2023-06-15T14:30:00Z');
      entity.description = 'Woman with brown hair, wearing a red jacket';
      entity.contact = '+1 (555) 987-6543';
      entity.recentPhoto = 'https://example.com/photos/jane.jpg';
      entity.isDeleted = false;
      entity.createdDate = new Date('2023-01-01');
      entity.updatedDate = new Date('2023-01-02');
      entity.user = mockUserEntity;
      entity.userId = mockUserEntity.id;

      // Mock the SearchFor.reconstitute method
      const mockReconstitute = jest.spyOn(SearchFor, 'reconstitute').mockImplementation(
        (id, type, name, birthdayYear, lastLocation, lastSeenDateTime, description, user, contact, recentPhoto, isDeleted, createdDate, updatedDate) => {
          return {
            id,
            type,
            name,
            birthdayYear,
            lastLocation,
            lastSeenDateTime,
            description,
            user,
            contact,
            recentPhoto,
            isDeleted,
            createdDate,
            updatedDate,
          } as SearchFor;
        }
      );

      // Act
      const domainSearchFor = entity.toDomain();

      // Assert
      expect(domainSearchFor).toBeDefined();
      expect(mockReconstitute).toHaveBeenCalledWith(
        entity.id,
        entity.type,
        entity.name,
        entity.birthdayYear,
        entity.lastLocation,
        entity.lastSeenDateTime,
        entity.description,
        mockUser,
        entity.contact,
        entity.recentPhoto,
        entity.isDeleted,
        entity.createdDate,
        entity.updatedDate,
      );
      expect(mockUserEntity.toDomain).toHaveBeenCalled();
      expect(domainSearchFor.id).toBe(entity.id);
      expect(domainSearchFor.type).toBe(entity.type);
      expect(domainSearchFor.name).toBe(entity.name);
      expect(domainSearchFor.birthdayYear).toBe(entity.birthdayYear);
      expect(domainSearchFor.lastLocation).toBe(entity.lastLocation);
      expect(domainSearchFor.lastSeenDateTime).toBe(entity.lastSeenDateTime);
      expect(domainSearchFor.description).toBe(entity.description);
      expect(domainSearchFor.contact).toBe(entity.contact);
      expect(domainSearchFor.recentPhoto).toBe(entity.recentPhoto);
      expect(domainSearchFor.user).toBe(mockUser);
      expect(domainSearchFor.isDeleted).toBe(entity.isDeleted);
      expect(domainSearchFor.createdDate).toBe(entity.createdDate);
      expect(domainSearchFor.updatedDate).toBe(entity.updatedDate);
    });

    it('should convert a SearchForEntity to a domain SearchFor using a provided user domain object', () => {
      // Arrange
      const entity = new SearchForEntity();
      entity.id = '456e7890-e89b-12d3-a456-426614174000';
      entity.type = SearchForType.PERSON;
      entity.name = 'Jane Doe';
      entity.birthdayYear = 1990;
      entity.lastLocation = 'Central Park, New York';
      entity.lastSeenDateTime = new Date('2023-06-15T14:30:00Z');
      entity.description = 'Woman with brown hair, wearing a red jacket';
      entity.contact = '+1 (555) 987-6543';
      entity.recentPhoto = 'https://example.com/photos/jane.jpg';
      entity.isDeleted = false;
      entity.createdDate = new Date('2023-01-01');
      entity.updatedDate = new Date('2023-01-02');
      entity.user = mockUserEntity;
      entity.userId = mockUserEntity.id;

      // Mock the SearchFor.reconstitute method
      const mockReconstitute = jest.spyOn(SearchFor, 'reconstitute').mockImplementation(
        (id, type, name, birthdayYear, lastLocation, lastSeenDateTime, description, user, contact, recentPhoto, isDeleted, createdDate, updatedDate) => {
          return {
            id,
            type,
            name,
            birthdayYear,
            lastLocation,
            lastSeenDateTime,
            description,
            user,
            contact,
            recentPhoto,
            isDeleted,
            createdDate,
            updatedDate,
          } as SearchFor;
        }
      );

      // Act
      const domainSearchFor = entity.toDomain(mockUser);

      // Assert
      expect(domainSearchFor).toBeDefined();
      expect(mockReconstitute).toHaveBeenCalledWith(
        entity.id,
        entity.type,
        entity.name,
        entity.birthdayYear,
        entity.lastLocation,
        entity.lastSeenDateTime,
        entity.description,
        mockUser,
        entity.contact,
        entity.recentPhoto,
        entity.isDeleted,
        entity.createdDate,
        entity.updatedDate,
      );
      expect(mockUserEntity.toDomain).not.toHaveBeenCalled(); // Should not be called when user is provided
      expect(domainSearchFor.user).toBe(mockUser);
    });

    it('should handle null recentPhoto when converting to domain', () => {
      // Arrange
      const entity = new SearchForEntity();
      entity.id = '456e7890-e89b-12d3-a456-426614174000';
      entity.type = SearchForType.PERSON;
      entity.name = 'Jane Doe';
      entity.birthdayYear = 1990;
      entity.lastLocation = 'Central Park, New York';
      entity.lastSeenDateTime = new Date('2023-06-15T14:30:00Z');
      entity.description = 'Woman with brown hair, wearing a red jacket';
      entity.contact = '+1 (555) 987-6543';
      entity.recentPhoto = null;
      entity.isDeleted = false;
      entity.createdDate = new Date('2023-01-01');
      entity.updatedDate = new Date('2023-01-02');
      entity.user = mockUserEntity;
      entity.userId = mockUserEntity.id;

      // Mock the SearchFor.reconstitute method
      const mockReconstitute = jest.spyOn(SearchFor, 'reconstitute').mockImplementation(
        (id, type, name, birthdayYear, lastLocation, lastSeenDateTime, description, user, contact, recentPhoto, isDeleted, createdDate, updatedDate) => {
          return {
            id,
            type,
            name,
            birthdayYear,
            lastLocation,
            lastSeenDateTime,
            description,
            user,
            contact,
            recentPhoto,
            isDeleted,
            createdDate,
            updatedDate,
          } as SearchFor;
        }
      );

      // Act
      const domainSearchFor = entity.toDomain();

      // Assert
      expect(domainSearchFor.recentPhoto).toBeNull();
      expect(mockReconstitute).toHaveBeenCalledWith(
        entity.id,
        entity.type,
        entity.name,
        entity.birthdayYear,
        entity.lastLocation,
        entity.lastSeenDateTime,
        entity.description,
        mockUser,
        entity.contact,
        null,
        entity.isDeleted,
        entity.createdDate,
        entity.updatedDate,
      );
    });
  });
});
