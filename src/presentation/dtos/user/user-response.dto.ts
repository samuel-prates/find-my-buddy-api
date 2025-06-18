import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ description: 'User document (ID, passport, etc.)', example: '123456789' })
  document: string;

  @ApiPropertyOptional({ description: 'URL to user photo', example: 'https://example.com/photo.jpg' })
  photo: string | null;

  @ApiProperty({ description: 'User contact information', example: '+1 (555) 123-4567' })
  contact: string;

  @ApiProperty({ description: 'Creation date', example: '2023-06-15T10:00:00Z' })
  createdDate: Date;

  @ApiProperty({ description: 'Last update date', example: '2023-06-15T10:00:00Z' })
  updatedDate: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.document = user.document;
    this.photo = user.photo;
    this.contact = user.contact;
    this.createdDate = user.createdDate;
    this.updatedDate = user.updatedDate;
  }

  static fromEntity(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }

  static fromEntities(users: User[]): UserResponseDto[] {
    return users.map(user => new UserResponseDto(user));
  }
}