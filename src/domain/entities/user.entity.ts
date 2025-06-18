import { v4 as uuidv4 } from 'uuid';

export class User {
  private readonly _id: string;
  private _name: string;
  private _email: string;
  private _document: string;
  private _photo: string | null;
  private _contact: string;
  private _isDeleted: boolean;
  private _createdDate: Date;
  private _updatedDate: Date;

  private constructor(
    id: string,
    name: string,
    email: string,
    document: string,
    contact: string,
    photo: string | null = null,
    isDeleted: boolean = false,
    createdDate: Date = new Date(),
    updatedDate: Date = new Date(),
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._document = document;
    this._photo = photo;
    this._contact = contact;
    this._isDeleted = isDeleted;
    this._createdDate = createdDate;
    this._updatedDate = updatedDate;
  }

  // Factory method to create a new user
  public static create(
    name: string,
    email: string,
    document: string,
    contact: string,
    photo: string | null = null,
  ): User {
    return new User(uuidv4(), name, email, document, contact, photo);
  }

  // Factory method to reconstitute a user from storage
  public static reconstitute(
    id: string,
    name: string,
    email: string,
    document: string,
    contact: string,
    photo: string | null,
    isDeleted: boolean,
    createdDate: Date,
    updatedDate: Date,
  ): User {
    return new User(
      id,
      name,
      email,
      document,
      contact,
      photo,
      isDeleted,
      createdDate,
      updatedDate,
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get document(): string {
    return this._document;
  }

  get photo(): string | null {
    return this._photo;
  }

  get contact(): string {
    return this._contact;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  get createdDate(): Date {
    return this._createdDate;
  }

  get updatedDate(): Date {
    return this._updatedDate;
  }

  // Methods to update user properties
  public updateName(name: string): void {
    this._name = name;
    this._updatedDate = new Date();
  }

  public updateEmail(email: string): void {
    this._email = email;
    this._updatedDate = new Date();
  }

  public updateDocument(document: string): void {
    this._document = document;
    this._updatedDate = new Date();
  }

  public updatePhoto(photo: string | null): void {
    this._photo = photo;
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