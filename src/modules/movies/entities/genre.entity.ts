import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('genres')
export class Genre {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
