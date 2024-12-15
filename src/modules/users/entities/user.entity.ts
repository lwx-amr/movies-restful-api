import { Watchlist } from '../../../modules/watchlist/entities/watchlist.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column({
    type: 'text',
  })
  password: string;

  @Column({
    type: 'text',
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 768,
    nullable: true,
  })
  refreshToken: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @OneToOne(() => Watchlist, (watchlist) => watchlist.user)
  watchlist: Watchlist;
}
