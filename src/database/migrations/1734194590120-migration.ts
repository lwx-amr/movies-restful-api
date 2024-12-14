import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734194590120 implements MigrationInterface {
    name = 'Migration1734194590120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "poster_path"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "vote_count"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "backdrop_path"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "release_date"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "vote_average"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "backdropPath" character varying`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "originalLanguage" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "originalTitle" character varying`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "posterPath" character varying`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "releaseDate" date`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "video" boolean`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "voteAverage" double precision`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "voteCount" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "voteCount"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "voteAverage"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "video"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "releaseDate"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "posterPath"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "originalTitle"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "originalLanguage"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "backdropPath"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "vote_average" double precision`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "release_date" date`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "backdrop_path" character varying`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "vote_count" integer`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "poster_path" character varying`);
    }

}
