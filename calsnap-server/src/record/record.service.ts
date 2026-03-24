import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MealRecord } from './entities/meal-record.entity';
import { UserService } from '../user/user.service';
import { CreateRecordDto } from './dto/create-record.dto';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(MealRecord)
    private readonly recordRepo: Repository<MealRecord>,
    private readonly userService: UserService,
  ) { }

  async create(dto: CreateRecordDto, userId: string): Promise<MealRecord> {
    const record = this.recordRepo.create({
      ...dto,
      recordedAt: new Date(dto.recordedAt),
      user_id: userId,
    });
    return this.recordRepo.save(record);
  }

  async getDailyRecords(userId: string, dateStr: string) {
    const { start, end } = this.getDateRange(dateStr);
    const user = await this.userService.findById(userId);

    const meals = await this.recordRepo.find({
      where: { user_id: userId, recordedAt: Between(start, end) },
      order: { recordedAt: 'ASC' },
    });

    const consumed = meals.reduce((sum, m) => sum + m.calories, 0);

    return {
      consumed,
      goal: user.goalCalorie,
      meals: meals.map((m) => ({
        id: m.id,
        name: m.name,
        calories: m.calories,
        time: m.recordedAt.toTimeString().slice(0, 5),
        mealType: m.mealType,
        icon: m.icon,
      })),
    };
  }

  async getDailyDetail(userId: string, dateStr: string) {
    const { start, end } = this.getDateRange(dateStr);
    const user = await this.userService.findById(userId);

    const meals = await this.recordRepo.find({
      where: { user_id: userId, recordedAt: Between(start, end) },
      order: { recordedAt: 'ASC' },
    });

    const consumed = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
    const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);
    const totalSodium = meals.reduce((sum, m) => sum + m.sodium, 0);

    const goalCarbs = Math.round(user.goalCalorie * 0.5 / 4);
    const goalProtein = Math.round(user.goalCalorie * 0.2 / 4);
    const goalFat = Math.round(user.goalCalorie * 0.3 / 9);

    const nutrients = [
      { label: '탄수화물', value: Math.round(totalCarbs), goal: goalCarbs, unit: 'g', color: '#F59E0B', icon: 'barley' },
      { label: '단백질', value: Math.round(totalProtein), goal: goalProtein, unit: 'g', color: '#EF4444', icon: 'arm-flex' },
      { label: '지방', value: Math.round(totalFat), goal: goalFat, unit: 'g', color: '#3B82F6', icon: 'water' },
      { label: '나트륨', value: Math.round(totalSodium), goal: 2000, unit: 'mg', color: '#8B5CF6', icon: 'shaker' },
    ];

    const mealTypeMap: Record<string, { icon: string; items: any[]; totalCalories: number }> = {};
    const mealIcons: Record<string, string> = {
      breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍪',
    };
    const mealLabels: Record<string, string> = {
      breakfast: '아침', lunch: '점심', dinner: '저녁', snack: '간식',
    };

    for (const m of meals) {
      const key = m.mealType;
      if (!mealTypeMap[key]) {
        mealTypeMap[key] = { icon: mealIcons[key] || '🍽️', items: [], totalCalories: 0 };
      }
      mealTypeMap[key].items.push({ name: m.name, calories: m.calories, serving: m.serving });
      mealTypeMap[key].totalCalories += m.calories;
    }

    const mealGroups = Object.entries(mealTypeMap).map(([type, data]) => ({
      type: mealLabels[type] || type,
      ...data,
    }));

    let tip = '오늘도 건강한 식사를 하고 계시네요!';
    if (totalProtein < goalProtein * 0.5) {
      tip = '단백질 섭취가 부족해요. 닭가슴살이나 두부를 추가해보세요!';
    } else if (consumed > user.goalCalorie) {
      tip = '오늘 목표 칼로리를 초과했어요. 내일은 가벼운 식사를 해보세요.';
    }

    return { consumed, goal: user.goalCalorie, nutrients, mealGroups, tip };
  }

  async getWeeklyStats(userId: string) {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await this.recordRepo.find({
      where: { user_id: userId, recordedAt: Between(weekAgo, endOfDay) },
    });

    const user = await this.userService.findById(userId);
    const dailyMap = new Map<string, number>();

    for (const m of meals) {
      const key = this.toLocalDateStr(m.recordedAt);
      dailyMap.set(key, (dailyMap.get(key) || 0) + m.calories);
    }

    const recordedDays = dailyMap.size;
    const totalCal = [...dailyMap.values()].reduce((s, v) => s + v, 0);
    const avgCalories = recordedDays > 0 ? Math.round(totalCal / recordedDays) : 0;
    const achievedDays = [...dailyMap.values()].filter((cal) => cal <= user.goalCalorie).length;
    const achievementRate = recordedDays > 0 ? Math.round((achievedDays / recordedDays) * 100) : 0;

    return {
      avgCalories: avgCalories.toLocaleString(),
      achievementRate: String(achievementRate),
      recordedDays: String(recordedDays),
    };
  }

  private toLocalDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async getTodaySummary(userId: string) {
    const today = new Date();
    const dateStr = this.toLocalDateStr(today);
    const { start, end } = this.getDateRange(dateStr);
    const user = await this.userService.findById(userId);

    const meals = await this.recordRepo.find({
      where: { user_id: userId, recordedAt: Between(start, end) },
      order: { recordedAt: 'ASC' },
    });

    const consumed = meals.reduce((sum, m) => sum + m.calories, 0);
    const carbs = Math.round(meals.reduce((sum, m) => sum + m.carbs, 0));
    const protein = Math.round(meals.reduce((sum, m) => sum + m.protein, 0));
    const fat = Math.round(meals.reduce((sum, m) => sum + m.fat, 0));

    const mealColors: Record<string, string> = {
      breakfast: '#4CAD53', lunch: '#F59E0B', dinner: '#3B82F6', snack: '#8B5CF6',
    };
    const mealIcons: Record<string, string> = {
      breakfast: 'fruit-cherries', lunch: 'food-drumstick', dinner: 'rice', snack: 'cookie',
    };

    return {
      date: today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      consumed,
      goal: user.goalCalorie,
      carbs,
      protein,
      fat,
      meals: meals.slice(0, 5).map((m) => ({
        id: m.id,
        name: m.name,
        calories: m.calories,
        time: m.recordedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        icon: mealIcons[m.mealType] || 'food',
        color: mealColors[m.mealType] || '#6B7280',
      })),
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    const record = await this.recordRepo.findOne({ where: { id, user_id: userId } });
    if (!record) throw new NotFoundException('기록을 찾을 수 없습니다');
    await this.recordRepo.remove(record);
  }

  async getRemainingCalories(userId: string): Promise<number> {
    const today = this.toLocalDateStr(new Date());
    const { start, end } = this.getDateRange(today);
    const user = await this.userService.findById(userId);

    const meals = await this.recordRepo.find({
      where: { user_id: userId, recordedAt: Between(start, end) },
    });
    const consumed = meals.reduce((sum, m) => sum + m.calories, 0);
    return Math.max(0, user.goalCalorie - consumed);
  }

  private getDateRange(dateStr: string) {
    const start = new Date(`${dateStr}T00:00:00`);
    const end = new Date(`${dateStr}T23:59:59.999`);
    return { start, end };
  }
}
