import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1687100000000 implements MigrationInterface {
  name = 'InitialMigration1687100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for search_for.type
    await queryRunner.query(`
      CREATE TYPE "public"."search_for_type_enum" AS ENUM('Person', 'Animal')
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "document" character varying NOT NULL,
        "photo" character varying,
        "contact" character varying NOT NULL,
        "isDeleted" boolean NOT NULL DEFAULT false,
        "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create search_for table
    await queryRunner.query(`
      CREATE TABLE "search_for" (
        "id" uuid NOT NULL,
        "type" "public"."search_for_type_enum" NOT NULL,
        "name" character varying NOT NULL,
        "birthdayYear" integer NOT NULL,
        "lastLocation" character varying NOT NULL,
        "lastSeenDateTime" TIMESTAMP NOT NULL,
        "description" text NOT NULL,
        "recentPhoto" character varying,
        "contact" character varying NOT NULL,
        "isDeleted" boolean NOT NULL DEFAULT false,
        "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_search_for" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "search_for" ADD CONSTRAINT "FK_search_for_user"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "search_for" DROP CONSTRAINT "FK_search_for_user"
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE "search_for"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop enum type
    await queryRunner.query(`DROP TYPE "public"."search_for_type_enum"`);
  }
}