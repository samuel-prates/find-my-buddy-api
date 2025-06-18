import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/ports/user-repository.interface';
import { USER_REPOSITORY } from '../../../domain/ports/injection-tokens';

export interface UpdateUserDto {
  name?: string;
  email?: string;
  document?: string;
  contact?: string;
  photo?: string | null;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Find the user
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it's already in use
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException(`User with email ${updateUserDto.email} already exists`);
      }
      user.updateEmail(updateUserDto.email);
    }

    // Update other fields if provided
    if (updateUserDto.name) {
      user.updateName(updateUserDto.name);
    }

    if (updateUserDto.document) {
      user.updateDocument(updateUserDto.document);
    }

    if (updateUserDto.contact) {
      user.updateContact(updateUserDto.contact);
    }

    if ('photo' in updateUserDto) {
      user.updatePhoto(updateUserDto.photo ?? null);
    }

    // Save and return the updated user
    return this.userRepository.save(user);
  }
}
