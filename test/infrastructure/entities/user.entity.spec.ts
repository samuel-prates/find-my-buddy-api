import { UserEntity } from '../../../src/infrastructure/entities/user.entity';
import { User } from '../../../src/domain/entities/user.entity';

describe('UserEntity', () => {
  describe('fromDomain', () => {
    it('should convert a domain User to a UserEntity', () => {
      // Arrange
      const domainUser = {
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

      // Act
      const entity = UserEntity.fromDomain(domainUser);

      // Assert
      expect(entity).toBeDefined();
      expect(entity).toBeInstanceOf(UserEntity);
      expect(entity.id).toBe(domainUser.id);
      expect(entity.name).toBe(domainUser.name);
      expect(entity.email).toBe(domainUser.email);
      expect(entity.document).toBe(domainUser.document);
      expect(entity.contact).toBe(domainUser.contact);
      expect(entity.photo).toBe(domainUser.photo);
      expect(entity.isDeleted).toBe(domainUser.isDeleted);
      expect(entity.createdDate).toBe(domainUser.createdDate);
      expect(entity.updatedDate).toBe(domainUser.updatedDate);
    });

    it('should handle null photo', () => {
      // Arrange
      const domainUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 'john.doe@example.com',
        document: '123456789',
        contact: '+1 (555) 123-4567',
        photo: null,
        isDeleted: false,
        createdDate: new Date('2023-01-01'),
        updatedDate: new Date('2023-01-02'),
      } as User;

      // Act
      const entity = UserEntity.fromDomain(domainUser);

      // Assert
      expect(entity.photo).toBeNull();
    });
  });

  describe('toDomain', () => {
    it('should convert a UserEntity to a domain User', () => {
      // Arrange
      const entity = new UserEntity();
      entity.id = '123e4567-e89b-12d3-a456-426614174000';
      entity.name = 'John Doe';
      entity.email = 'john.doe@example.com';
      entity.document = '123456789';
      entity.contact = '+1 (555) 123-4567';
      entity.photo = 'https://example.com/photo.jpg';
      entity.isDeleted = false;
      entity.createdDate = new Date('2023-01-01');
      entity.updatedDate = new Date('2023-01-02');

      // Mock the User.reconstitute method
      const mockReconstitute = jest.spyOn(User, 'reconstitute').mockImplementation(
        (id, name, email, document, contact, photo, isDeleted, createdDate, updatedDate) => {
          return {
            id,
            name,
            email,
            document,
            contact,
            photo,
            isDeleted,
            createdDate,
            updatedDate,
          } as User;
        }
      );

      // Act
      const domainUser = entity.toDomain();

      // Assert
      expect(domainUser).toBeDefined();
      expect(mockReconstitute).toHaveBeenCalledWith(
        entity.id,
        entity.name,
        entity.email,
        entity.document,
        entity.contact,
        entity.photo,
        entity.isDeleted,
        entity.createdDate,
        entity.updatedDate,
      );
      expect(domainUser.id).toBe(entity.id);
      expect(domainUser.name).toBe(entity.name);
      expect(domainUser.email).toBe(entity.email);
      expect(domainUser.document).toBe(entity.document);
      expect(domainUser.contact).toBe(entity.contact);
      expect(domainUser.photo).toBe(entity.photo);
      expect(domainUser.isDeleted).toBe(entity.isDeleted);
      expect(domainUser.createdDate).toBe(entity.createdDate);
      expect(domainUser.updatedDate).toBe(entity.updatedDate);

      // Clean up
      mockReconstitute.mockRestore();
    });

    it('should handle null photo when converting to domain', () => {
      // Arrange
      const entity = new UserEntity();
      entity.id = '123e4567-e89b-12d3-a456-426614174000';
      entity.name = 'John Doe';
      entity.email = 'john.doe@example.com';
      entity.document = '123456789';
      entity.contact = '+1 (555) 123-4567';
      entity.photo = null;
      entity.isDeleted = false;
      entity.createdDate = new Date('2023-01-01');
      entity.updatedDate = new Date('2023-01-02');

      // Mock the User.reconstitute method
      const mockReconstitute = jest.spyOn(User, 'reconstitute').mockImplementation(
        (id, name, email, document, contact, photo, isDeleted, createdDate, updatedDate) => {
          return {
            id,
            name,
            email,
            document,
            contact,
            photo,
            isDeleted,
            createdDate,
            updatedDate,
          } as User;
        }
      );

      // Act
      const domainUser = entity.toDomain();

      // Assert
      expect(domainUser.photo).toBeNull();
      expect(mockReconstitute).toHaveBeenCalledWith(
        entity.id,
        entity.name,
        entity.email,
        entity.document,
        entity.contact,
        null,
        entity.isDeleted,
        entity.createdDate,
        entity.updatedDate,
      );

      // Clean up
      mockReconstitute.mockRestore();
    });
  });
});