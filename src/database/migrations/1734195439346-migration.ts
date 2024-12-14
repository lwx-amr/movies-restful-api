import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734195439346 implements MigrationInterface {
    name = 'Migration1734195439346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "adult" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "originalLanguage" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "originalLanguage" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" ALTER COLUMN "adult" SET NOT NULL`);
    }

}
