import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { SearchHistory } from './entities/search-history.entity';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Food, SearchHistory])],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
