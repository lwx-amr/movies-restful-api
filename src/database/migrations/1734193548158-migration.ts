import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734193548158 implements MigrationInterface {
    name = 'Migration1734193548158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" DROP CONSTRAINT "FK_cb43556a8849221b82cd17461c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb43556a8849221b82cd17461c"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD "tmdbId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies" DROP CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD CONSTRAINT "PK_1f8d5447a9cc9f55e63cbf44e2d" PRIMARY KEY ("id", "tmdbId")`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" ADD "moviesTmdbId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" DROP CONSTRAINT "PK_59537f354fd4a79606cc4f3cf1b"`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" ADD CONSTRAINT "PK_7d31d22c0e0ef61436792710bd3" PRIMARY KEY ("moviesId", "genresId", "moviesTmdbId")`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" DROP CONSTRAINT "FK_ccf6c10277da37e9fc265863fab"`);
        await queryRunner.query(`ALTER TABLE "genres" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "genres_id_seq"`);
        await queryRunner.query(`CREATE INDEX "IDX_72d2469cc2bcb500bd423d8dd0" ON "movies_genres_genres" ("moviesId", "moviesTmdbId") `);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" ADD CONSTRAINT "FK_72d2469cc2bcb500bd423d8dd0b" FOREIGN KEY ("moviesId", "moviesTmdbId") REFERENCES "movies"("id","tmdbId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" ADD CONSTRAINT "FK_ccf6c10277da37e9fc265863fab" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" DROP CONSTRAINT "FK_ccf6c10277da37e9fc265863fab"`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" DROP CONSTRAINT "FK_72d2469cc2bcb500bd423d8dd0b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_72d2469cc2bcb500bd423d8dd0"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "genres_id_seq" OWNED BY "genres"."id"`);
        await queryRunner.query(`ALTER TABLE "genres" ALTER COLUMN "id" SET DEFAULT nextval('"genres_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" ADD CONSTRAINT "FK_ccf6c10277da37e9fc265863fab" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" DROP CONSTRAINT "PK_7d31d22c0e0ef61436792710bd3"`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" ADD CONSTRAINT "PK_59537f354fd4a79606cc4f3cf1b" PRIMARY KEY ("moviesId", "genresId")`);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" DROP COLUMN "moviesTmdbId"`);
        await queryRunner.query(`ALTER TABLE "movies" DROP CONSTRAINT "PK_1f8d5447a9cc9f55e63cbf44e2d"`);
        await queryRunner.query(`ALTER TABLE "movies" ADD CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "movies" DROP COLUMN "tmdbId"`);
        await queryRunner.query(`CREATE INDEX "IDX_cb43556a8849221b82cd17461c" ON "movies_genres_genres" ("moviesId") `);
        await queryRunner.query(`ALTER TABLE "movies_genres_genres" ADD CONSTRAINT "FK_cb43556a8849221b82cd17461c8" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
