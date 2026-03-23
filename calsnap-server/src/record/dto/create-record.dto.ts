import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MealType } from '../entities/meal-record.entity';

export class CreateRecordDto {
  @ApiProperty({ example: '김치찌개' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '1인분' })
  @IsOptional()
  @IsString()
  serving?: string;

  @ApiProperty({ example: 320 })
  @IsNumber()
  @Min(0)
  calories: number;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  carbs?: number;

  @ApiPropertyOptional({ example: 18 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fat?: number;

  @ApiPropertyOptional({ example: 890 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sodium?: number;

  @ApiProperty({ enum: MealType, example: 'lunch' })
  @IsEnum(MealType)
  mealType: MealType;

  @ApiPropertyOptional({ example: '🍲' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ example: 'https://...' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  capturedByAi?: boolean;

  @ApiProperty({ example: '2026-03-23T12:45:00.000Z' })
  @IsDateString()
  recordedAt: string;
}
