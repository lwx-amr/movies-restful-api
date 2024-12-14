import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734186317183 implements MigrationInterface {
  name = 'Migration1734186317183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "genres" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_f105f8230a83b86a346427de94d" UNIQUE ("name"), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movies" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "overview" character varying NOT NULL, "release_date" character varying NOT NULL, "poster_path" character varying NOT NULL, "vote_average" integer NOT NULL, "vote_count" integer NOT NULL, "popularity" integer NOT NULL, CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movies_genres_genres" ("moviesId" integer NOT NULL, "genresId" integer NOT NULL, CONSTRAINT "PK_59537f354fd4a79606cc4f3cf1b" PRIMARY KEY ("moviesId", "genresId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_cb43556a8849221b82cd17461c" ON "movies_genres_genres" ("moviesId") `);
    await queryRunner.query(`CREATE INDEX "IDX_ccf6c10277da37e9fc265863fa" ON "movies_genres_genres" ("genresId") `);
    await queryRunner.query(
      `ALTER TABLE "movies_genres_genres" ADD CONSTRAINT "FK_cb43556a8849221b82cd17461c8" FOREIGN KEY ("moviesId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "movies_genres_genres" ADD CONSTRAINT "FK_ccf6c10277da37e9fc265863fab" FOREIGN KEY ("genresId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movies_genres_genres" DROP CONSTRAINT "FK_ccf6c10277da37e9fc265863fab"`);
    await queryRunner.query(`ALTER TABLE "movies_genres_genres" DROP CONSTRAINT "FK_cb43556a8849221b82cd17461c8"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ccf6c10277da37e9fc265863fa"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cb43556a8849221b82cd17461c"`);
    await queryRunner.query(`DROP TABLE "movies_genres_genres"`);
    await queryRunner.query(`DROP TABLE "movies"`);
    await queryRunner.query(`DROP TABLE "genres"`);
  }
}
