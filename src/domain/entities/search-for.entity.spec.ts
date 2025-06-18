import { SearchFor, SearchForType } from './search-for.entity';
import { User } from './user.entity';

describe('SearchFor Entity', () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = User.create(
      'John Doe',
      'john.doe@example.com',
      '123456789',
      '+1 (555) 123-4567',
    );
  });

  describe('create', () => {
    it('should create a new search item with the provided values', () => {
      // Arrange
      const type = SearchForType.PERSON;
      const name = 'Jane Doe';
      const birthdayYear = 1990;
      const lastLocation = 'Central Park, New York';
      const lastSeenDateTime = new Date('2023-06-15T14:30:00Z');
      const description = 'Woman with brown hair, wearing a red jacket';
      const contact = '+1 (555) 987-6543';
      const recentPhoto = 'https://example.com/photos/jane.jpg';

      // Act
      const searchFor = SearchFor.create(
        type,
        name,
        birthdayYear,
        lastLocation,
        lastSeenDateTime,
        description,
        mockUser,
        contact,
        recentPhoto,
      );

      // Assert
      expect(searchFor).toBeDefined();
      expect(searchFor.id).toBeDefined();
      expect(searchFor.type).toBe(type);
      expect(searchFor.name).toBe(name);
      expect(searchFor.birthdayYear).toBe(birthdayYear);
      expect(searchFor.lastLocation).toBe(lastLocation);
      expect(searchFor.lastSeenDateTime).toBe(lastSeenDateTime);
      expect(searchFor.description).toBe(description);
      expect(searchFor.contact).toBe(contact);
      expect(searchFor.recentPhoto).toBe(recentPhoto);
      expect(searchFor.user).toBe(mockUser);
      expect(searchFor.isDeleted).toBe(false);
      expect(searchFor.createdDate).toBeInstanceOf(Date);
      expect(searchFor.updatedDate).toBeInstanceOf(Date);
    });

    it('should create a search item with null recentPhoto when not provided', () => {
      // Act
      const searchFor = SearchFor.create(
        SearchForType.ANIMAL,
        'Max',
        2015,
        'Downtown Park',
        new Date(),
        'Golden retriever with a red collar',
        mockUser,
        '+1 (555) 987-6543',
      );

      // Assert
      expect(searchFor.recentPhoto).toBeNull();
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a search item with all properties', () => {
      // Arrange
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const type = SearchForType.ANIMAL;
      const name = 'Max';
      const birthdayYear = 2015;
      const lastLocation = 'Downtown Park';
      const lastSeenDateTime = new Date('2023-06-15T14:30:00Z');
      const description = 'Golden retriever with a red collar';
      const contact = '+1 (555) 987-6543';
      const recentPhoto = 'https://example.com/photos/max.jpg';
      const isDeleted = false;
      const createdDate = new Date('2023-01-01');
      const updatedDate = new Date('2023-01-02');

      // Act
      const searchFor = SearchFor.reconstitute(
        id,
        type,
        name,
        birthdayYear,
        lastLocation,
        lastSeenDateTime,
        description,
        mockUser,
        contact,
        recentPhoto,
        isDeleted,
        createdDate,
        updatedDate,
      );

      // Assert
      expect(searchFor).toBeDefined();
      expect(searchFor.id).toBe(id);
      expect(searchFor.type).toBe(type);
      expect(searchFor.name).toBe(name);
      expect(searchFor.birthdayYear).toBe(birthdayYear);
      expect(searchFor.lastLocation).toBe(lastLocation);
      expect(searchFor.lastSeenDateTime).toBe(lastSeenDateTime);
      expect(searchFor.description).toBe(description);
      expect(searchFor.contact).toBe(contact);
      expect(searchFor.recentPhoto).toBe(recentPhoto);
      expect(searchFor.user).toBe(mockUser);
      expect(searchFor.isDeleted).toBe(isDeleted);
      expect(searchFor.createdDate).toBe(createdDate);
      expect(searchFor.updatedDate).toBe(updatedDate);
    });
  });

  describe('update methods', () => {
    let searchFor: SearchFor;

    beforeEach(() => {
      searchFor = SearchFor.create(
        SearchForType.PERSON,
        'Jane Doe',
        1990,
        'Central Park, New York',
        new Date('2023-06-15T14:30:00Z'),
        'Woman with brown hair, wearing a red jacket',
        mockUser,
        '+1 (555) 987-6543',
      );
    });

    it('should update type', () => {
      // Act
      searchFor.updateType(SearchForType.ANIMAL);
      
      // Assert
      expect(searchFor.type).toBe(SearchForType.ANIMAL);
      expect(searchFor.updatedDate).not.toBe(searchFor.createdDate);
    });

    it('should update name', () => {
      // Arrange
      const newName = 'Jane Smith';
      
      // Act
      searchFor.updateName(newName);
      
      // Assert
      expect(searchFor.name).toBe(newName);
      expect(searchFor.updatedDate).not.toBe(searchFor.createdDate);
    });

    it('should mark as deleted', () => {
      // Act
      searchFor.markAsDeleted();
      
      // Assert
      expect(searchFor.isDeleted).toBe(true);
      expect(searchFor.updatedDate).not.toBe(searchFor.createdDate);
    });

    it('should restore a deleted search item', () => {
      // Arrange
      searchFor.markAsDeleted();
      
      // Act
      searchFor.restore();
      
      // Assert
      expect(searchFor.isDeleted).toBe(false);
      expect(searchFor.updatedDate).not.toBe(searchFor.createdDate);
    });
  });
});