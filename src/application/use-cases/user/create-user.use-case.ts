import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/ports/user-repository.interface';
import { USER_REPOSITORY } from '../../../domain/ports/injection-tokens';

export interface CreateUserDto {
  name: string;
  email: string;
  document: string;
  contact: string;
  photo?: string | null;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with the same email already exists
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(`User with email ${createUserDto.email} already exists`);
    }

    // Create a new user
    const user = User.create(
      createUserDto.name,
      createUserDto.email,
      createUserDto.document,
      createUserDto.contact,
      createUserDto.photo || null,
    );

    // Save and return the user
    return this.userRepository.save(user);
  }
}