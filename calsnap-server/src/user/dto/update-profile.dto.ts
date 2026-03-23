import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, ActivityLevel } from '../entities/user.entity';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: '홍길동' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: 28 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(150)
  age?: number;

  @ApiPropertyOptional({ example: 175 })
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(300)
  height?: number;

  @ApiPropertyOptional({ example: 72 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(500)
  weight?: number;

  @ApiPropertyOptional({ enum: ActivityLevel })
  @IsOptional()
  @IsEnum(ActivityLevel)
  activityLevel?: ActivityLevel;
}
