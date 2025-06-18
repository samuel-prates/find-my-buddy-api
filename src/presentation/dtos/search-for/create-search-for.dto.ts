import { IsString, IsNotEmpty, IsEnum, IsInt, IsISO8601, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SearchForType } from '../../../domain/entities/search-for.entity';
import { Type } from 'class-transformer';

export class CreateSearchForDto {
  @ApiProperty({ 
    description: 'Type of search (Person or Animal)', 
    enum: SearchForType,
    example: SearchForType.PERSON 
  })
  @IsEnum(SearchForType)
  @IsNotEmpty()
  type: SearchForType;

  @ApiProperty({ description: 'Name of the person or animal', example: 'Max' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Birth year', example: 2010 })
  @IsInt()
  @Type(() => Number)
  birthdayYear: number;

  @ApiProperty({ description: 'Last known location', example: 'Central Park, New York' })
  @IsString()
  @IsNotEmpty()
  lastLocation: string;

  @ApiProperty({ 
    description: 'Date and time when last seen (ISO format)', 
    example: '2023-06-15T14:30:00Z' 
  })
  @IsISO8601()
  @Type(() => Date)
  lastSeenDateTime: Date;

  @ApiProperty({ 
    description: 'Detailed description of the person or animal', 
    example: 'Golden retriever with a red collar, responds to the name Max' 
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Contact information', example: '+1 (555) 123-4567' })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty({ description: 'ID of the user who created this search', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ 
    description: 'URL to a recent photo', 
    example: 'https://example.com/photos/max.jpg' 
  })
  @IsString()
  @IsOptional()
  recentPhoto?: string;
}