import { DataSource } from 'typeorm';
import { Food } from '../food/entities/food.entity';
import { User } from '../user/entities/user.entity';
import { config } from 'dotenv';

config();

const SEED_FOODS = [
  { name: '현미밥', serving: '1공기 (210g)', calories: 310, carbs: 65, protein: 6, fat: 1, sodium: 5, icon: '🍚' },
  { name: '사과', serving: '1개 (200g)', calories: 104, carbs: 27, protein: 0, fat: 0, sodium: 1, icon: '🍎' },
  { name: '닭가슴살 샐러드', serving: '1인분', calories: 320, carbs: 12, protein: 35, fat: 8, sodium: 450, icon: '🥗' },
  { name: '삶은 달걀', serving: '1개 (60g)', calories: 78, carbs: 1, protein: 6, fat: 5, sodium: 62, icon: '🥚' },
  { name: '바나나', serving: '1개 (120g)', calories: 105, carbs: 27, protein: 1, fat: 0, sodium: 1, icon: '🍌' },
  { name: '김치찌개', serving: '1인분', calories: 320, carbs: 45, protein: 18, fat: 12, sodium: 890, icon: '🍲' },
  { name: '비빔밥', serving: '1인분', calories: 580, carbs: 78, protein: 22, fat: 15, sodium: 780, icon: '🍚' },
  { name: '토스트', serving: '2장', calories: 250, carbs: 30, protein: 8, fat: 12, sodium: 350, icon: '🍞' },
  { name: '프로틴 바', serving: '1개 (60g)', calories: 210, carbs: 22, protein: 20, fat: 8, sodium: 180, icon: '🍫' },
  { name: '연어 스테이크', serving: '1인분 (200g)', calories: 412, carbs: 0, protein: 40, fat: 28, sodium: 120, icon: '🐟' },
  { name: '시리얼', serving: '1그릇 + 우유', calories: 280, carbs: 45, protein: 8, fat: 6, sodium: 220, icon: '🥣' },
  { name: '치킨', serving: '1인분 (3조각)', calories: 550, carbs: 18, protein: 38, fat: 35, sodium: 820, icon: '🍗' },
  { name: '된장찌개', serving: '1그릇', calories: 108, carbs: 12, protein: 8, fat: 4, sodium: 920, icon: '🍲' },
  { name: '통밀 식빵', serving: '2조각', calories: 180, carbs: 32, protein: 7, fat: 3, sodium: 290, icon: '🍞' },
  { name: '아이스크림', serving: '1스쿱', calories: 270, carbs: 32, protein: 4, fat: 14, sodium: 80, icon: '🍦' },
  { name: '그릭 요거트', serving: '1개 (150g)', calories: 130, carbs: 8, protein: 15, fat: 4, sodium: 55, icon: '🥛' },
  { name: '아메리카노', serving: '1잔 (355ml)', calories: 15, carbs: 3, protein: 0, fat: 0, sodium: 5, icon: '☕' },
  { name: '떡볶이', serving: '1인분', calories: 430, carbs: 72, protein: 10, fat: 12, sodium: 1100, icon: '🌶️' },
  { name: '고구마', serving: '1개 (150g)', calories: 130, carbs: 31, protein: 2, fat: 0, sodium: 15, icon: '🍠' },
  { name: '두부', serving: '반 모 (150g)', calories: 120, carbs: 3, protein: 13, fat: 7, sodium: 10, icon: '🧈' },
];

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'calsnap',
    password: process.env.DB_PASSWORD || 'calsnap1234',
    database: process.env.DB_NAME || 'calsnap',
    entities: [Food, User],
    synchronize: true,
  });

  await dataSource.initialize();
  const foodRepo = dataSource.getRepository(Food);

  const count = await foodRepo.count();
  if (count > 0) {
    console.log(`이미 ${count}개의 음식 데이터가 있습니다. 시드를 건너뜁니다.`);
    await dataSource.destroy();
    return;
  }

  for (const item of SEED_FOODS) {
    const food = foodRepo.create({ ...item, isCustom: false });
    await foodRepo.save(food);
  }

  console.log(`${SEED_FOODS.length}개의 음식 데이터가 추가되었습니다.`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed 실패:', err);
  process.exit(1);
});
