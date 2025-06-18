import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User name', example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'User email', example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'User document (ID, passport, etc.)', example: '123456789' })
  @IsString()
  @IsOptional()
  document?: string;

  @ApiPropertyOptional({ description: 'User contact information', example: '+1 (555) 123-4567' })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiPropertyOptional({ description: 'URL to user photo', example: 'https://example.com/photo.jpg' })
  @IsString()
  @IsOptional()
  photo?: string;
}