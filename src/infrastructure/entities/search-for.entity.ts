import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SearchFor as DomainSearchFor, SearchForType } from '../../domain/entities/search-for.entity';
import { UserEntity } from './user.entity';

@Entity('search_for')
export class SearchForEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SearchForType,
  })
  type: SearchForType;

  @Column()
  name: string;

  @Column()
  birthdayYear: number;

  @Column()
  lastLocation: string;

  @Column({ type: 'timestamp' })
  lastSeenDateTime: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  recentPhoto: string | null;

  @Column()
  contact: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => UserEntity, user => user.searchItems)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: string;

  // Convert from domain entity to TypeORM entity
  static fromDomain(domainSearchFor: DomainSearchFor, userEntity?: UserEntity): SearchForEntity {
    const entity = new SearchForEntity();
    entity.id = domainSearchFor.id;
    entity.type = domainSearchFor.type;
    entity.name = domainSearchFor.name;
    entity.birthdayYear = domainSearchFor.birthdayYear;
    entity.lastLocation = domainSearchFor.lastLocation;
    entity.lastSeenDateTime = domainSearchFor.lastSeenDateTime;
    entity.description = domainSearchFor.description;
    entity.recentPhoto = domainSearchFor.recentPhoto;
    entity.contact = domainSearchFor.contact;
    entity.isDeleted = domainSearchFor.isDeleted;
    entity.createdDate = domainSearchFor.createdDate;
    entity.updatedDate = domainSearchFor.updatedDate;

    if (userEntity) {
      entity.user = userEntity;
      entity.userId = userEntity.id;
    } else {
      entity.userId = domainSearchFor.user.id;
    }

    return entity;
  }

  // Convert from TypeORM entity to domain entity
  toDomain(userDomain?: ReturnType<UserEntity['toDomain']>): DomainSearchFor {
    const user = userDomain || this.user.toDomain();

    return DomainSearchFor.reconstitute(
      this.id,
      this.type,
      this.name,
      this.birthdayYear,
      this.lastLocation,
      this.lastSeenDateTime,
      this.description,
      user,
      this.contact,
      this.recentPhoto,
      this.isDeleted,
      this.createdDate,
      this.updatedDate,
    );
  }
}
