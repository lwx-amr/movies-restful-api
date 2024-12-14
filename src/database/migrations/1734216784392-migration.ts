import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734216784392 implements MigrationInterface {
  name = 'Migration1734216784392';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "voteAverage"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "voteAverage" numeric(10,2) NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "averageRating"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "averageRating" numeric(10,2) NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "averageRating"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "averageRating" double precision NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "voteAverage"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "voteAverage" double precision`);
  }
}
