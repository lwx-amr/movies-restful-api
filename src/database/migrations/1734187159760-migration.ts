import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734187159760 implements MigrationInterface {
  name = 'Migration1734187159760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies" ADD "backdrop_path" character varying`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "adult" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "overview"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "overview" text`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "release_date"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "release_date" date`);
    await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "poster_path" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "vote_average"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "vote_average" double precision`);
    await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "vote_count" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "popularity"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "popularity" double precision`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "popularity"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "popularity" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "vote_count" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "vote_average"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "vote_average" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "poster_path" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "release_date"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "release_date" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "overview"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "overview" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "adult"`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "backdrop_path"`);
  }
}
