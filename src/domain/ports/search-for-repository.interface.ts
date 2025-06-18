import { SearchFor, SearchForType } from '../entities/search-for.entity';

export interface SearchForRepository {
  findAll(): Promise<SearchFor[]>;
  findById(id: string): Promise<SearchFor | null>;
  findByUser(userId: string): Promise<SearchFor[]>;
  findByType(type: SearchForType): Promise<SearchFor[]>;
  save(searchFor: SearchFor): Promise<SearchFor>;
  delete(id: string): Promise<void>;
}