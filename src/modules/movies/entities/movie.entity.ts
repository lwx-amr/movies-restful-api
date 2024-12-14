import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';
import { Genre } from './genre.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  tmdbId: number;

  @Column({ nullable: true })
  adult: boolean;

  @Column({ nullable: true })
  backdropPath?: string;

  @Column({ nullable: true })
  originalLanguage: string;

  @Column({ nullable: true })
  originalTitle?: string;

  @Column({ type: 'text', nullable: true })
  overview?: string;

  @Column({ type: 'float', nullable: true })
  popularity?: number;

  @Column({ nullable: true })
  posterPath?: string;

  @Column({ type: 'date', nullable: true })
  releaseDate?: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  video?: boolean;

  @Column({ type: 'float', nullable: true })
  voteAverage?: number;

  @Column({ nullable: true })
  voteCount?: number;

  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];
}
