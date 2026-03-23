import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGoalDto {
  @ApiPropertyOptional({ example: 2100 })
  @IsOptional()
  @IsNumber()
  @Min(500)
  goalCalorie?: number;

  @ApiPropertyOptional({ example: '체중 유지' })
  @IsOptional()
  @IsString()
  goalType?: string;
}
