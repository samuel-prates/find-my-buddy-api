import { Test, TestingModule } from '@nestjs/testing';
import { SearchForController } from '../../../src/presentation/controllers/search-for.controller';
import { GetAllSearchForUseCase } from '../../../src/application/use-cases/search-for/get-all-search-for.use-case';
import { GetSearchForByIdUseCase } from '../../../src/application/use-cases/search-for/get-search-for-by-id.use-case';
import { CreateSearchForUseCase } from '../../../src/application/use-cases/search-for/create-search-for.use-case';
import { UpdateSearchForUseCase } from '../../../src/application/use-cases/search-for/update-search-for.use-case';
import { DeleteSearchForUseCase } from '../../../src/application/use-cases/search-for/delete-search-for.use-case';
import { CreateSearchForDto } from '../../../src/presentation/dtos/search-for/create-search-for.dto';
import { UpdateSearchForDto } from '../../../src/presentation/dtos/search-for/update-search-for.dto';
import { SearchForResponseDto } from '../../../src/presentation/dtos/search-for/search-for-response.dto';
import { SearchFor, SearchForType } from '../../../src/domain/entities/search-for.entity';
import { User } from '../../../src/domain/entities/user.entity';
import { UserResponseDto } from '../../../src/presentation/dtos/user/user-response.dto';

describe('SearchForController', () => {
  let controller: SearchForController;
  let getAllSearchForUseCase: jest.Mocked<GetAllSearchForUseCase>;
  let getSearchForByIdUseCase: jest.Mocked<GetSearchForByIdUseCase>;
  let createSearchForUseCase: jest.Mocked<CreateSearchForUseCase>;
  let updateSearchForUseCase: jest.Mocked<UpdateSearchForUseCase>;
  let deleteSearchForUseCase: jest.Mocked<DeleteSearchForUseCase>;
  let mockUser: User;
  let mockSearchFor: SearchFor;
  let mockUserResponseDto: UserResponseDto;

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

    mockUserResponseDto = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      document: mockUser.document,
      contact: mockUser.contact,
      photo: mockUser.photo,
      createdDate: mockUser.createdDate,
      updatedDate: mockUser.updatedDate,
    } as UserResponseDto;

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

    // Create mocks for the use cases
    getAllSearchForUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetAllSearchForUseCase>;

    getSearchForByIdUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetSearchForByIdUseCase>;

    createSearchForUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateSearchForUseCase>;

    updateSearchForUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateSearchForUseCase>;

    deleteSearchForUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeleteSearchForUseCase>;

    // Create a mock UserResponseDto class
    mockUserResponseDto = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      document: mockUser.document,
      contact: mockUser.contact,
      photo: mockUser.photo,
      createdDate: mockUser.createdDate,
      updatedDate: mockUser.updatedDate,
    } as UserResponseDto;

    // Mock the static methods of SearchForResponseDto
    jest.spyOn(SearchForResponseDto, 'fromEntity').mockImplementation((searchFor) => {
      return {
        id: searchFor.id,
        type: searchFor.type,
        name: searchFor.name,
        birthdayYear: searchFor.birthdayYear,
        lastLocation: searchFor.lastLocation,
        lastSeenDateTime: searchFor.lastSeenDateTime,
        description: searchFor.description,
        recentPhoto: searchFor.recentPhoto,
        contact: searchFor.contact,
        user: mockUserResponseDto,
        createdDate: searchFor.createdDate,
        updatedDate: searchFor.updatedDate,
      } as SearchForResponseDto;
    });

    jest.spyOn(SearchForResponseDto, 'fromEntities').mockImplementation((searchFors) => {
      return searchFors.map(searchFor => ({
        id: searchFor.id,
        type: searchFor.type,
        name: searchFor.name,
        birthdayYear: searchFor.birthdayYear,
        lastLocation: searchFor.lastLocation,
        lastSeenDateTime: searchFor.lastSeenDateTime,
        description: searchFor.description,
        recentPhoto: searchFor.recentPhoto,
        contact: searchFor.contact,
        user: mockUserResponseDto,
        createdDate: searchFor.createdDate,
        updatedDate: searchFor.updatedDate,
      } as SearchForResponseDto));
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchForController],
      providers: [
        { provide: GetAllSearchForUseCase, useValue: getAllSearchForUseCase },
        { provide: GetSearchForByIdUseCase, useValue: getSearchForByIdUseCase },
        { provide: CreateSearchForUseCase, useValue: createSearchForUseCase },
        { provide: UpdateSearchForUseCase, useValue: updateSearchForUseCase },
        { provide: DeleteSearchForUseCase, useValue: deleteSearchForUseCase },
      ],
    }).compile();

    controller = module.get<SearchForController>(SearchForController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSearchFor', () => {
    it('should create a search item and return a SearchForResponseDto', async () => {
      // Arrange
      const createSearchForDto: CreateSearchForDto = {
        type: SearchForType.PERSON,
        name: 'Jane Doe',
        birthdayYear: 1990,
        lastLocation: 'Central Park, New York',
        lastSeenDateTime: new Date('2023-06-15T14:30:00Z'),
        description: 'Woman with brown hair, wearing a red jacket',
        contact: '+1 (555) 987-6543',
        userId: mockUser.id,
        recentPhoto: 'https://example.com/photos/jane.jpg',
      };
      createSearchForUseCase.execute.mockResolvedValue(mockSearchFor);

      // Act
      const result = await controller.createSearchFor(createSearchForDto);

      // Assert
      expect(createSearchForUseCase.execute).toHaveBeenCalledWith(createSearchForDto);
      expect(SearchForResponseDto.fromEntity).toHaveBeenCalledWith(mockSearchFor);
      expect(result).toEqual({
        id: mockSearchFor.id,
        type: mockSearchFor.type,
        name: mockSearchFor.name,
        birthdayYear: mockSearchFor.birthdayYear,
        lastLocation: mockSearchFor.lastLocation,
        lastSeenDateTime: mockSearchFor.lastSeenDateTime,
        description: mockSearchFor.description,
        recentPhoto: mockSearchFor.recentPhoto,
        contact: mockSearchFor.contact,
        user: mockUserResponseDto,
        createdDate: mockSearchFor.createdDate,
        updatedDate: mockSearchFor.updatedDate,
      });
    });
  });

  describe('getAllSearchFor', () => {
    it('should return an array of SearchForResponseDto', async () => {
      // Arrange
      const mockSearchFors = [mockSearchFor, mockSearchFor];
      getAllSearchForUseCase.execute.mockResolvedValue(mockSearchFors);

      // Act
      const result = await controller.getAllSearchFor();

      // Assert
      expect(getAllSearchForUseCase.execute).toHaveBeenCalled();
      expect(SearchForResponseDto.fromEntities).toHaveBeenCalledWith(mockSearchFors);
      expect(result).toEqual([
        {
          id: mockSearchFor.id,
          type: mockSearchFor.type,
          name: mockSearchFor.name,
          birthdayYear: mockSearchFor.birthdayYear,
          lastLocation: mockSearchFor.lastLocation,
          lastSeenDateTime: mockSearchFor.lastSeenDateTime,
          description: mockSearchFor.description,
          recentPhoto: mockSearchFor.recentPhoto,
          contact: mockSearchFor.contact,
          user: mockUserResponseDto,
          createdDate: mockSearchFor.createdDate,
          updatedDate: mockSearchFor.updatedDate,
        },
        {
          id: mockSearchFor.id,
          type: mockSearchFor.type,
          name: mockSearchFor.name,
          birthdayYear: mockSearchFor.birthdayYear,
          lastLocation: mockSearchFor.lastLocation,
          lastSeenDateTime: mockSearchFor.lastSeenDateTime,
          description: mockSearchFor.description,
          recentPhoto: mockSearchFor.recentPhoto,
          contact: mockSearchFor.contact,
          user: mockUserResponseDto,
          createdDate: mockSearchFor.createdDate,
          updatedDate: mockSearchFor.updatedDate,
        },
      ]);
    });

    it('should handle query parameters but still return all search items for now', async () => {
      // Arrange
      const mockSearchFors = [mockSearchFor];
      getAllSearchForUseCase.execute.mockResolvedValue(mockSearchFors);
      const type = SearchForType.PERSON;
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const result = await controller.getAllSearchFor(type, userId);

      // Assert
      expect(getAllSearchForUseCase.execute).toHaveBeenCalled();
      expect(SearchForResponseDto.fromEntities).toHaveBeenCalledWith(mockSearchFors);
      expect(result).toHaveLength(1);
    });
  });

  describe('getSearchForById', () => {
    it('should return a SearchForResponseDto for the specified ID', async () => {
      // Arrange
      const searchForId = '456e7890-e89b-12d3-a456-426614174000';
      getSearchForByIdUseCase.execute.mockResolvedValue(mockSearchFor);

      // Act
      const result = await controller.getSearchForById(searchForId);

      // Assert
      expect(getSearchForByIdUseCase.execute).toHaveBeenCalledWith(searchForId);
      expect(SearchForResponseDto.fromEntity).toHaveBeenCalledWith(mockSearchFor);
      expect(result).toEqual({
        id: mockSearchFor.id,
        type: mockSearchFor.type,
        name: mockSearchFor.name,
        birthdayYear: mockSearchFor.birthdayYear,
        lastLocation: mockSearchFor.lastLocation,
        lastSeenDateTime: mockSearchFor.lastSeenDateTime,
        description: mockSearchFor.description,
        recentPhoto: mockSearchFor.recentPhoto,
        contact: mockSearchFor.contact,
        user: mockUserResponseDto,
        createdDate: mockSearchFor.createdDate,
        updatedDate: mockSearchFor.updatedDate,
      });
    });
  });

  describe('updateSearchFor', () => {
    it('should update a search item and return a SearchForResponseDto', async () => {
      // Arrange
      const searchForId = '456e7890-e89b-12d3-a456-426614174000';
      const updateSearchForDto: UpdateSearchForDto = {
        name: 'Jane Smith',
        lastLocation: 'Times Square, New York',
      };
      const updatedSearchFor = { 
        ...mockSearchFor, 
        name: 'Jane Smith', 
        lastLocation: 'Times Square, New York'
      } as SearchFor;
      updateSearchForUseCase.execute.mockResolvedValue(updatedSearchFor);

      // Act
      const result = await controller.updateSearchFor(searchForId, updateSearchForDto);

      // Assert
      expect(updateSearchForUseCase.execute).toHaveBeenCalledWith(searchForId, updateSearchForDto);
      expect(SearchForResponseDto.fromEntity).toHaveBeenCalledWith(updatedSearchFor);
      expect(result).toEqual({
        id: updatedSearchFor.id,
        type: updatedSearchFor.type,
        name: updatedSearchFor.name,
        birthdayYear: updatedSearchFor.birthdayYear,
        lastLocation: updatedSearchFor.lastLocation,
        lastSeenDateTime: updatedSearchFor.lastSeenDateTime,
        description: updatedSearchFor.description,
        recentPhoto: updatedSearchFor.recentPhoto,
        contact: updatedSearchFor.contact,
        user: mockUserResponseDto,
        createdDate: updatedSearchFor.createdDate,
        updatedDate: updatedSearchFor.updatedDate,
      });
    });
  });

  describe('deleteSearchFor', () => {
    it('should delete a search item', async () => {
      // Arrange
      const searchForId = '456e7890-e89b-12d3-a456-426614174000';
      deleteSearchForUseCase.execute.mockResolvedValue(undefined);

      // Act
      await controller.deleteSearchFor(searchForId);

      // Assert
      expect(deleteSearchForUseCase.execute).toHaveBeenCalledWith(searchForId);
    });
  });
});
