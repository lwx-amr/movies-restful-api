import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { Movie } from 'src/modules/movies/entities/movie.entity';
import { Genre } from 'src/modules/movies/entities/genre.entity';

config({ path: process.cwd() + '/.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [Movie, Genre],
  migrations: [join(__dirname, '..', 'database', 'migrations', '*.ts')],
  migrationsRun: false,
});

export default AppDataSource;