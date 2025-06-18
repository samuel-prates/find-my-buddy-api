import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchForRepository } from '../../domain/ports/search-for-repository.interface';
import { SearchFor, SearchForType } from '../../domain/entities/search-for.entity';
import { SearchForEntity } from '../entities/search-for.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class TypeOrmSearchForRepository implements SearchForRepository {
  constructor(
    @InjectRepository(SearchForEntity)
    private readonly searchForRepository: Repository<SearchForEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<SearchFor[]> {
    const entities = await this.searchForRepository.find({
      where: { isDeleted: false },
      relations: ['user'],
    });
    return entities.map(entity => entity.toDomain());
  }

  async findById(id: string): Promise<SearchFor | null> {
    const entity = await this.searchForRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user'],
    });
    return entity ? entity.toDomain() : null;
  }

  async findByUser(userId: string): Promise<SearchFor[]> {
    const entities = await this.searchForRepository.find({
      where: { userId, isDeleted: false },
      relations: ['user'],
    });
    return entities.map(entity => entity.toDomain());
  }

  async findByType(type: SearchForType): Promise<SearchFor[]> {
    const entities = await this.searchForRepository.find({
      where: { type, isDeleted: false },
      relations: ['user'],
    });
    return entities.map(entity => entity.toDomain());
  }

  async save(searchFor: SearchFor): Promise<SearchFor> {
    // Get the user entity
    const userEntity = await this.userRepository.findOne({
      where: { id: searchFor.user.id },
    });

    if (!userEntity) {
      throw new Error(`User with id ${searchFor.user.id} not found`);
    }

    // Create and save the search entity
    const entity = SearchForEntity.fromDomain(searchFor, userEntity);
    const savedEntity = await this.searchForRepository.save(entity);
    
    // Load the user relation for the saved entity
    const fullEntity = await this.searchForRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['user'],
    });

    return fullEntity!.toDomain();
  }

  async delete(id: string): Promise<void> {
    const searchFor = await this.findById(id);
    if (searchFor) {
      searchFor.markAsDeleted();
      await this.save(searchFor);
    }
  }
}