import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734216879322 implements MigrationInterface {
  name = 'Migration1734216879322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "voteAverage"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "voteAverage" double precision`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "voteAverage"`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "voteAverage" numeric(10,2) NOT NULL DEFAULT '0'`);
  }
}
