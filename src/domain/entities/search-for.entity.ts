import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

export enum SearchForType {
  PERSON = 'Person',
  ANIMAL = 'Animal',
}

export class SearchFor {
  private readonly _id: string;
  private _type: SearchForType;
  private _name: string;
  private _birthdayYear: number;
  private _lastLocation: string;
  private _lastSeenDateTime: Date;
  private _description: string;
  private _recentPhoto: string | null;
  private _contact: string;
  private _user: User;
  private _createdDate: Date;
  private _updatedDate: Date;
  private _isDeleted: boolean;

  private constructor(
    id: string,
    type: SearchForType,
    name: string,
    birthdayYear: number,
    lastLocation: string,
    lastSeenDateTime: Date,
    description: string,
    user: User,
    contact: string,
    recentPhoto: string | null = null,
    isDeleted: boolean = false,
    createdDate: Date = new Date(),
    updatedDate: Date = new Date(),
  ) {
    this._id = id;
    this._type = type;
    this._name = name;
    this._birthdayYear = birthdayYear;
    this._lastLocation = lastLocation;
    this._lastSeenDateTime = lastSeenDateTime;
    this._description = description;
    this._recentPhoto = recentPhoto;
    this._contact = contact;
    this._user = user;
    this._isDeleted = isDeleted;
    this._createdDate = createdDate;
    this._updatedDate = updatedDate;
  }

  // Factory method to create a new search item
  public static create(
    type: SearchForType,
    name: string,
    birthdayYear: number,
    lastLocation: string,
    lastSeenDateTime: Date,
    description: string,
    user: User,
    contact: string,
    recentPhoto: string | null = null,
  ): SearchFor {
    return new SearchFor(
      uuidv4(),
      type,
      name,
      birthdayYear,
      lastLocation,
      lastSeenDateTime,
      description,
      user,
      contact,
      recentPhoto,
    );
  }

  // Factory method to reconstitute a search item from storage
  public static reconstitute(
    id: string,
    type: SearchForType,
    name: string,
    birthdayYear: number,
    lastLocation: string,
    lastSeenDateTime: Date,
    description: string,
    user: User,
    contact: string,
    recentPhoto: string | null,
    isDeleted: boolean,
    createdDate: Date,
    updatedDate: Date,
  ): SearchFor {
    return new SearchFor(
      id,
      type,
      name,
      birthdayYear,
      lastLocation,
      lastSeenDateTime,
      description,
      user,
      contact,
      recentPhoto,
      isDeleted,
      createdDate,
      updatedDate,
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get type(): SearchForType {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get birthdayYear(): number {
    return this._birthdayYear;
  }

  get lastLocation(): string {
    return this._lastLocation;
  }

  get lastSeenDateTime(): Date {
    return this._lastSeenDateTime;
  }

  get description(): string {
    return this._description;
  }

  get recentPhoto(): string | null {
    return this._recentPhoto;
  }

  get contact(): string {
    return this._contact;
  }

  get user(): User {
    return this._user;
  }

  get createdDate(): Date {
    return this._createdDate;
  }

  get updatedDate(): Date {
    return this._updatedDate;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  // Methods to update search item properties
  public updateType(type: SearchForType): void {
    this._type = type;
    this._updatedDate = new Date();
  }

  public updateName(name: string): void {
    this._name = name;
    this._updatedDate = new Date();
  }

  public updateBirthdayYear(birthdayYear: number): void {
    this._birthdayYear = birthdayYear;
    this._updatedDate = new Date();
  }

  public updateLastLocation(lastLocation: string): void {
    this._lastLocation = lastLocation;
    this._updatedDate = new Date();
  }

  public updateLastSeenDateTime(lastSeenDateTime: Date): void {
    this._lastSeenDateTime = lastSeenDateTime;
    this._updatedDate = new Date();
  }

  public updateDescription(description: string): void {
    this._description = description;
    this._updatedDate = new Date();
  }

  public updateRecentPhoto(recentPhoto: string | null): void {
    this._recentPhoto = recentPhoto;
    this._updatedDate = new Date();
  }

  public updateContact(contact: string): void {
    this._contact = contact;
    this._updatedDate = new Date();
  }

  public markAsDeleted(): void {
    this._isDeleted = true;
    this._updatedDate = new Date();
  }

  public restore(): void {
    this._isDeleted = false;
    this._updatedDate = new Date();
  }
}