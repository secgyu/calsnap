import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('foods')
export class Food {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  serving: string;

  @Column()
  calories: number;

  @Column({ type: 'float', default: 0 })
  carbs: number;

  @Column({ type: 'float', default: 0 })
  protein: number;

  @Column({ type: 'float', default: 0 })
  fat: number;

  @Column({ type: 'float', default: 0 })
  sodium: number;

  @Column({ default: '🍽️' })
  icon: string;

  @Column({ default: false })
  isCustom: boolean;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ nullable: true })
  created_by: string;

  @CreateDateColumn()
  createdAt: Date;
}
