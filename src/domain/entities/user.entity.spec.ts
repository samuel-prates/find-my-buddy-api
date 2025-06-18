import { User } from './user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a new user with the provided values', () => {
      // Arrange
      const name = 'John Doe';
      const email = 'john.doe@example.com';
      const document = '123456789';
      const contact = '+1 (555) 123-4567';
      const photo = 'https://example.com/photo.jpg';

      // Act
      const user = User.create(name, email, document, contact, photo);

      // Assert
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe(name);
      expect(user.email).toBe(email);
      expect(user.document).toBe(document);
      expect(user.contact).toBe(contact);
      expect(user.photo).toBe(photo);
      expect(user.isDeleted).toBe(false);
      expect(user.createdDate).toBeInstanceOf(Date);
      expect(user.updatedDate).toBeInstanceOf(Date);
    });

    it('should create a user with null photo when not provided', () => {
      // Arrange
      const name = 'John Doe';
      const email = 'john.doe@example.com';
      const document = '123456789';
      const contact = '+1 (555) 123-4567';

      // Act
      const user = User.create(name, email, document, contact);

      // Assert
      expect(user.photo).toBeNull();
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a user with all properties', () => {
      // Arrange
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const name = 'John Doe';
      const email = 'john.doe@example.com';
      const document = '123456789';
      const contact = '+1 (555) 123-4567';
      const photo = 'https://example.com/photo.jpg';
      const isDeleted = false;
      const createdDate = new Date('2023-01-01');
      const updatedDate = new Date('2023-01-02');

      // Act
      const user = User.reconstitute(
        id,
        name,
        email,
        document,
        contact,
        photo,
        isDeleted,
        createdDate,
        updatedDate,
      );

      // Assert
      expect(user).toBeDefined();
      expect(user.id).toBe(id);
      expect(user.name).toBe(name);
      expect(user.email).toBe(email);
      expect(user.document).toBe(document);
      expect(user.contact).toBe(contact);
      expect(user.photo).toBe(photo);
      expect(user.isDeleted).toBe(isDeleted);
      expect(user.createdDate).toBe(createdDate);
      expect(user.updatedDate).toBe(updatedDate);
    });
  });

  describe('update methods', () => {
    let user: User;

    beforeEach(() => {
      user = User.create(
        'John Doe',
        'john.doe@example.com',
        '123456789',
        '+1 (555) 123-4567',
      );
    });

    it('should update name', () => {
      // Arrange
      const newName = 'Jane Doe';
      
      // Act
      user.updateName(newName);
      
      // Assert
      expect(user.name).toBe(newName);
      expect(user.updatedDate).not.toBe(user.createdDate);
    });

    it('should update email', () => {
      // Arrange
      const newEmail = 'jane.doe@example.com';
      
      // Act
      user.updateEmail(newEmail);
      
      // Assert
      expect(user.email).toBe(newEmail);
      expect(user.updatedDate).not.toBe(user.createdDate);
    });

    it('should mark as deleted', () => {
      // Act
      user.markAsDeleted();
      
      // Assert
      expect(user.isDeleted).toBe(true);
      expect(user.updatedDate).not.toBe(user.createdDate);
    });

    it('should restore a deleted user', () => {
      // Arrange
      user.markAsDeleted();
      
      // Act
      user.restore();
      
      // Assert
      expect(user.isDeleted).toBe(false);
      expect(user.updatedDate).not.toBe(user.createdDate);
    });
  });
});