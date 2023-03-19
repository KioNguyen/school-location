import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn() id: number;
  @Column() loca_number: string;
  @Column() loca_name: string;
  @Column() area: number;
  @Column() description: string;
  @Column() building: number;
  @Column() level: number;
  @Column({ nullable: true }) parent_id: number;
  @ManyToOne(() => Location, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent: Location;
}
