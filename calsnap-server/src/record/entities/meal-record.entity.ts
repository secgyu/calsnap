import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

@Entity('meal_records')
export class MealRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column()
  name: string;

  @Column({ default: '1인분' })
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

  @Column({ type: 'enum', enum: MealType })
  mealType: MealType;

  @Column({ default: '🍽️' })
  icon: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: false })
  capturedByAi: boolean;

  @Column({ type: 'timestamp' })
  recordedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
