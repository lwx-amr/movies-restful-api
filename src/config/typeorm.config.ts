import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { Movie } from 'src/modules/movies/entities/movie.entity';
import { Genre } from 'src/modules/movies/entities/genre.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Watchlist } from 'src/modules/watchlist/entities/watchlist.entity';

config({ path: process.cwd() + '/.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [Movie, Genre, User, Watchlist],
  migrations: [join(__dirname, '..', 'database', 'migrations', '*.js')],
  migrationsRun: true,
  migrationsTransactionMode: 'each',
  migrationsTableName: 'migrations',
});

export default AppDataSource;
