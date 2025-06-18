import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SearchFor, SearchForType } from '../../../domain/entities/search-for.entity';
import { UserResponseDto } from '../user/user-response.dto';

export class SearchForResponseDto {
  @ApiProperty({ description: 'Search item ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ 
    description: 'Type of search (Person or Animal)', 
    enum: SearchForType,
    example: SearchForType.PERSON 
  })
  type: SearchForType;

  @ApiProperty({ description: 'Name of the person or animal', example: 'Max' })
  name: string;

  @ApiProperty({ description: 'Birth year', example: 2010 })
  birthdayYear: number;

  @ApiProperty({ description: 'Last known location', example: 'Central Park, New York' })
  lastLocation: string;

  @ApiProperty({ 
    description: 'Date and time when last seen', 
    example: '2023-06-15T14:30:00Z' 
  })
  lastSeenDateTime: Date;

  @ApiProperty({ 
    description: 'Detailed description of the person or animal', 
    example: 'Golden retriever with a red collar, responds to the name Max' 
  })
  description: string;

  @ApiPropertyOptional({ 
    description: 'URL to a recent photo', 
    example: 'https://example.com/photos/max.jpg' 
  })
  recentPhoto: string | null;

  @ApiProperty({ description: 'Contact information', example: '+1 (555) 123-4567' })
  contact: string;

  @ApiProperty({ description: 'User who created this search' })
  user: UserResponseDto;

  @ApiProperty({ description: 'Creation date', example: '2023-06-15T10:00:00Z' })
  createdDate: Date;

  @ApiProperty({ description: 'Last update date', example: '2023-06-15T10:00:00Z' })
  updatedDate: Date;

  constructor(searchFor: SearchFor) {
    this.id = searchFor.id;
    this.type = searchFor.type;
    this.name = searchFor.name;
    this.birthdayYear = searchFor.birthdayYear;
    this.lastLocation = searchFor.lastLocation;
    this.lastSeenDateTime = searchFor.lastSeenDateTime;
    this.description = searchFor.description;
    this.recentPhoto = searchFor.recentPhoto;
    this.contact = searchFor.contact;
    this.user = new UserResponseDto(searchFor.user);
    this.createdDate = searchFor.createdDate;
    this.updatedDate = searchFor.updatedDate;
  }

  static fromEntity(searchFor: SearchFor): SearchForResponseDto {
    return new SearchForResponseDto(searchFor);
  }

  static fromEntities(searchFors: SearchFor[]): SearchForResponseDto[] {
    return searchFors.map(searchFor => new SearchForResponseDto(searchFor));
  }
}