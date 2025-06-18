import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../domain/ports/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const entities = await this.userRepository.find({
      where: { isDeleted: false },
    });
    return entities.map(entity => entity.toDomain());
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });
    return entity ? entity.toDomain() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({
      where: { email, isDeleted: false },
    });
    return entity ? entity.toDomain() : null;
  }

  async save(user: User): Promise<User> {
    const entity = UserEntity.fromDomain(user);
    const savedEntity = await this.userRepository.save(entity);
    return savedEntity.toDomain();
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      user.markAsDeleted();
      await this.save(user);
    }
  }
}