import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn() id: number;
  @Column() address: string;
  @ManyToOne(() => Location, { onDelete: 'CASCADE' }) parent: Location;
}
