import { IsString, IsEnum, IsInt, IsISO8601, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SearchForType } from '../../../domain/entities/search-for.entity';
import { Type } from 'class-transformer';

export class UpdateSearchForDto {
  @ApiPropertyOptional({ 
    description: 'Type of search (Person or Animal)', 
    enum: SearchForType,
    example: SearchForType.PERSON 
  })
  @IsEnum(SearchForType)
  @IsOptional()
  type?: SearchForType;

  @ApiPropertyOptional({ description: 'Name of the person or animal', example: 'Max' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Birth year', example: 2010 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  birthdayYear?: number;

  @ApiPropertyOptional({ description: 'Last known location', example: 'Central Park, New York' })
  @IsString()
  @IsOptional()
  lastLocation?: string;

  @ApiPropertyOptional({ 
    description: 'Date and time when last seen (ISO format)', 
    example: '2023-06-15T14:30:00Z' 
  })
  @IsISO8601()
  @IsOptional()
  @Type(() => Date)
  lastSeenDateTime?: Date;

  @ApiPropertyOptional({ 
    description: 'Detailed description of the person or animal', 
    example: 'Golden retriever with a red collar, responds to the name Max' 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Contact information', example: '+1 (555) 123-4567' })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiPropertyOptional({ 
    description: 'URL to a recent photo', 
    example: 'https://example.com/photos/max.jpg' 
  })
  @IsString()
  @IsOptional()
  recentPhoto?: string;
}