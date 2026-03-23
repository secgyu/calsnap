import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RecordQueryDto {
  @ApiPropertyOptional({ example: '2026-03-23', description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsString()
  date?: string;
}
