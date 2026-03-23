import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Foods')
@Controller('foods')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  @ApiOperation({ summary: '음식 검색' })
  @ApiQuery({ name: 'q', required: false, description: '검색어' })
  search(@Query('q') q: string, @Request() req: any) {
    return this.foodService.search(q || '', req.user.id);
  }

  @Get('recent-searches')
  @ApiOperation({ summary: '최근 검색어 목록' })
  getRecentSearches(@Request() req: any) {
    return this.foodService.getRecentSearches(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '음식 상세 조회' })
  findOne(@Param('id') id: string) {
    return this.foodService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: '커스텀 음식 등록' })
  create(@Body() dto: CreateFoodDto, @Request() req: any) {
    return this.foodService.create(dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '커스텀 음식 삭제' })
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.foodService.remove(id, req.user.id);
    return { message: '음식이 삭제되었습니다' };
  }
}
