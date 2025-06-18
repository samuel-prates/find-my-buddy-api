import { Entity, Column, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User as DomainUser } from '../../domain/entities/user.entity';
import { SearchForEntity } from './search-for.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  document: string;

  @Column({ nullable: true })
  photo: string | null;

  @Column()
  contact: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => SearchForEntity, searchFor => searchFor.user)
  searchItems: SearchForEntity[];

  // Convert from domain entity to TypeORM entity
  static fromDomain(domainUser: DomainUser): UserEntity {
    const entity = new UserEntity();
    entity.id = domainUser.id;
    entity.name = domainUser.name;
    entity.email = domainUser.email;
    entity.document = domainUser.document;
    entity.photo = domainUser.photo;
    entity.contact = domainUser.contact;
    entity.isDeleted = domainUser.isDeleted;
    entity.createdDate = domainUser.createdDate;
    entity.updatedDate = domainUser.updatedDate;
    return entity;
  }

  // Convert from TypeORM entity to domain entity
  toDomain(): DomainUser {
    return DomainUser.reconstitute(
      this.id,
      this.name,
      this.email,
      this.document,
      this.contact,
      this.photo,
      this.isDeleted,
      this.createdDate,
      this.updatedDate,
    );
  }
}