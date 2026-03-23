import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository, ILike } from 'typeorm';
import axios from 'axios';
import { Food } from './entities/food.entity';
import { SearchHistory } from './entities/search-history.entity';
import { CreateFoodDto } from './dto/create-food.dto';

interface PublicApiFoodItem {
  FOOD_NM_KR: string;
  FOOD_CD: string;
  AMT_NUM1: string; // 에너지(kcal)
  AMT_NUM3: string; // 단백질(g)
  AMT_NUM4: string; // 지방(g)
  AMT_NUM6: string; // 탄수화물(g)
  AMT_NUM13: string; // 나트륨(mg)
  SERVING_SIZE: string; // 1회 제공량 (예: "100g")
  FOOD_OR_NM: string; // 출처
  Z10500: string; // 총 내용량 (예: "900.000g")
}

@Injectable()
export class FoodService {
  private readonly logger = new Logger(FoodService.name);
  private readonly FOOD_API_URL =
    'https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02';

  constructor(
    @InjectRepository(Food)
    private readonly foodRepo: Repository<Food>,
    @InjectRepository(SearchHistory)
    private readonly searchRepo: Repository<SearchHistory>,
    private readonly config: ConfigService,
  ) { }

  async search(query: string, userId: string): Promise<any[]> {
    if (!query.trim()) {
      return this.foodRepo.find({ order: { name: 'ASC' }, take: 20 });
    }

    await this.saveSearchQuery(userId, query.trim());

    const [dbResults, publicResults] = await Promise.allSettled([
      this.searchFromDb(query.trim()),
      this.searchFromPublicApi(query.trim()),
    ]);

    const dbFoods = dbResults.status === 'fulfilled' ? dbResults.value : [];
    const apiFoods = publicResults.status === 'fulfilled' ? publicResults.value : [];

    const dbNames = new Set(dbFoods.map((f) => f.name));
    const uniqueApiFoods = apiFoods.filter((f: any) => !dbNames.has(f.name));

    return [...dbFoods, ...uniqueApiFoods].slice(0, 30);
  }

  private async searchFromDb(query: string): Promise<Food[]> {
    return this.foodRepo.find({
      where: { name: ILike(`%${query}%`) },
      order: { name: 'ASC' },
      take: 20,
    });
  }

  private async searchFromPublicApi(query: string): Promise<any[]> {
    const apiKey = this.config.get('FOOD_API_KEY_ENCODED');
    if (!apiKey) return [];

    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.FOOD_API_URL}?serviceKey=${apiKey}&FOOD_NM_KR=${encodedQuery}&pageNo=1&numOfRows=20&type=json`;
      const { data } = await axios.get(url, { timeout: 5000 });

      const items: PublicApiFoodItem[] =
        data?.body?.items ?? [];

      return items.map((item) => {
        const servingSize = item.SERVING_SIZE || '100g';
        const totalSize = item.Z10500
          ? item.Z10500.replace(/,/g, '').replace('g', '').trim()
          : null;
        const displayServing = totalSize
          ? `1인분 (${Math.round(parseFloat(totalSize))}g)`
          : servingSize;

        const scale = totalSize
          ? parseFloat(totalSize) / 100
          : 1;

        return {
          id: `public_${item.FOOD_CD}`,
          name: item.FOOD_NM_KR.replace(/_/g, ' '),
          serving: displayServing,
          calories: Math.round((parseFloat(item.AMT_NUM1) || 0) * scale),
          carbs: Math.round((parseFloat(item.AMT_NUM6) || 0) * scale),
          protein: Math.round((parseFloat(item.AMT_NUM3) || 0) * scale),
          fat: Math.round((parseFloat(item.AMT_NUM4) || 0) * scale),
          sodium: Math.round(
            parseFloat((item.AMT_NUM13 || '0').replace(/,/g, '')) * scale,
          ),
          icon: '🍽️',
          isCustom: false,
          source: item.FOOD_OR_NM || '식약처',
        };
      });
    } catch (err) {
      this.logger.warn(`공공 API 검색 실패: ${err.message}`);
      return [];
    }
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
