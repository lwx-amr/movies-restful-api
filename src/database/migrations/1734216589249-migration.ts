import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734216589249 implements MigrationInterface {
  name = 'Migration1734216589249';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies" ADD "averageRating" double precision NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "movies" ADD "ratingCount" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "ratingCount"`);
    await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "averageRating"`);
  }
}
