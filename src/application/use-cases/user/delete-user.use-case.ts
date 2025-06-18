import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user-repository.interface';
import { USER_REPOSITORY } from '../../../domain/ports/injection-tokens';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id);
  }
}