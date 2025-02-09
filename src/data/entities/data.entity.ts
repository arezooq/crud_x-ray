import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
@Entity({ name: 'data' })
export class DataEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    deviceId: number;
  
    @Column('float')
    xCoordination: number;
  
    @Column('float')
    yCoordination: number;
  
    @Column('float')
    speed: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    time: Date;
  }