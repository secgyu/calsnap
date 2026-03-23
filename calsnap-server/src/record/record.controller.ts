import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { RecordQueryDto } from './dto/record-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Records')
@Controller('records')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  @ApiOperation({ summary: '식사 기록 등록' })
  create(@Body() dto: CreateRecordDto, @Request() req: any) {
    return this.recordService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '일별 기록 조회' })
  getDailyRecords(@Query() query: RecordQueryDto, @Request() req: any) {
    const date = query.date || new Date().toISOString().slice(0, 10);
    return this.recordService.getDailyRecords(req.user.id, date);
  }

  @Get('today')
  @ApiOperation({ summary: '오늘 요약 (홈 화면용)' })
  getTodaySummary(@Request() req: any) {
    return this.recordService.getTodaySummary(req.user.id);
  }

  @Get('weekly')
  @ApiOperation({ summary: '주간 통계' })
  getWeeklyStats(@Request() req: any) {
    return this.recordService.getWeeklyStats(req.user.id);
  }

  @Get('daily/:date')
  @ApiOperation({ summary: '일별 상세 (영양소 + 식사 그룹)' })
  getDailyDetail(@Param('date') date: string, @Request() req: any) {
    return this.recordService.getDailyDetail(req.user.id, date);
  }

  @Delete(':id')
  @ApiOperation({ summary: '기록 삭제' })
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.recordService.remove(id, req.user.id);
    return { message: '기록이 삭제되었습니다' };
  }
}
