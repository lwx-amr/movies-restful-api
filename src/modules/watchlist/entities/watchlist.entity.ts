import { Movie } from '../../../modules/movies/entities/movie.entity';
import { User } from '../../../modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';

@Entity('watchlists')
export class Watchlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.watchlist, { cascade: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Movie, (movie) => movie.id)
  @JoinTable()
  movies: Movie[];

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
