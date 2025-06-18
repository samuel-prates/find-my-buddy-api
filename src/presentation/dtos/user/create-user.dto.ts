import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User document (ID, passport, etc.)', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({ description: 'User contact information', example: '+1 (555) 123-4567' })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiPropertyOptional({ description: 'URL to user photo', example: 'https://example.com/photo.jpg' })
  @IsString()
  @IsOptional()
  photo?: string;
}