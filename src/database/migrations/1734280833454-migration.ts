import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734280833454 implements MigrationInterface {
  name = 'Migration1734280833454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "watchlists" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" integer, CONSTRAINT "PK_aa3c717b50a10f7a435c65eda5a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "watchlists_movies_movies" ("watchlistsId" integer NOT NULL, "moviesId" integer NOT NULL, "moviesTmdbId" integer NOT NULL, CONSTRAINT "PK_3550f878f96e1fbdd8e38a6a3e4" PRIMARY KEY ("watchlistsId", "moviesId", "moviesTmdbId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_9544d22ce598e822a254519777" ON "watchlists_movies_movies" ("watchlistsId") `);
    await queryRunner.query(`CREATE INDEX "IDX_4f1f8eabcfaa6c4bc80653579c" ON "watchlists_movies_movies" ("moviesId", "moviesTmdbId") `);
    await queryRunner.query(
      `ALTER TABLE "watchlists" ADD CONSTRAINT "FK_4ee2b11c974ca3f516a391e1543" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "watchlists_movies_movies" ADD CONSTRAINT "FK_9544d22ce598e822a254519777c" FOREIGN KEY ("watchlistsId") REFERENCES "watchlists"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "watchlists_movies_movies" ADD CONSTRAINT "FK_4f1f8eabcfaa6c4bc80653579cd" FOREIGN KEY ("moviesId", "moviesTmdbId") REFERENCES "movies"("id","tmdbId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "watchlists_movies_movies" DROP CONSTRAINT "FK_4f1f8eabcfaa6c4bc80653579cd"`);
    await queryRunner.query(`ALTER TABLE "watchlists_movies_movies" DROP CONSTRAINT "FK_9544d22ce598e822a254519777c"`);
    await queryRunner.query(`ALTER TABLE "watchlists" DROP CONSTRAINT "FK_4ee2b11c974ca3f516a391e1543"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4f1f8eabcfaa6c4bc80653579c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9544d22ce598e822a254519777"`);
    await queryRunner.query(`DROP TABLE "watchlists_movies_movies"`);
    await queryRunner.query(`DROP TABLE "watchlists"`);
  }
}
