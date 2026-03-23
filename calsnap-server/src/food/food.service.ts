import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Food } from './entities/food.entity';
import { SearchHistory } from './entities/search-history.entity';
import { CreateFoodDto } from './dto/create-food.dto';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,
    @InjectRepository(SearchHistory)
    private readonly searchRepo: Repository<SearchHistory>,
  ) {}

  async search(query: string, userId: string): Promise<Food[]> {
    if (query.trim()) {
      await this.saveSearchQuery(userId, query.trim());
      return this.foodRepo.find({
        where: { name: ILike(`%${query.trim()}%`) },
        order: { name: 'ASC' },
        take: 20,
      });
    }
    return this.foodRepo.find({ order: { name: 'ASC' }, take: 20 });
  }

  async findById(id: string): Promise<Food> {
    const food = await this.foodRepo.findOne({ where: { id } });
    if (!food) throw new NotFoundException('음식을 찾을 수 없습니다');
    return food;
  }

  async create(dto: CreateFoodDto, userId: string): Promise<Food> {
    const food = this.foodRepo.create({
      ...dto,
      isCustom: true,
      created_by: userId,
    });
    return this.foodRepo.save(food);
  }

  async remove(id: string, userId: string): Promise<void> {
    const food = await this.findById(id);
    if (food.created_by !== userId) {
      throw new NotFoundException('삭제 권한이 없습니다');
    }
    await this.foodRepo.remove(food);
  }

  async getRecentSearches(userId: string): Promise<string[]> {
    const records = await this.searchRepo.find({
      where: { user_id: userId },
      order: { searchedAt: 'DESC' },
      take: 10,
    });
    const unique = [...new Set(records.map((r) => r.query))];
    return unique.slice(0, 5);
  }

  private async saveSearchQuery(userId: string, query: string): Promise<void> {
    const entry = this.searchRepo.create({ user_id: userId, query });
    await this.searchRepo.save(entry);
  }
}
