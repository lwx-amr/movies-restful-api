import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734187432901 implements MigrationInterface {
    name = 'Migration1734187432901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "adult" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "adult" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "title" character varying NOT NULL`);
    }

}
