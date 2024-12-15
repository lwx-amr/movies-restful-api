import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFullTextSearchToMovies1671234567891 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE movies ADD COLUMN tsv tsvector;
      CREATE INDEX idx_movies_tsv ON movies USING gin(tsv);
      UPDATE movies SET tsv = to_tsvector('english', coalesce(title, '') || ' ' || coalesce(overview, ''));
      CREATE TRIGGER tsv_update BEFORE INSERT OR UPDATE ON movies
      FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger(tsv, 'pg_catalog.english', title, overview);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS tsv_update ON movies;
      DROP INDEX IF EXISTS idx_movies_tsv;
      ALTER TABLE movies DROP COLUMN tsv;
    `);
  }
}
