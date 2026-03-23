import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { RecordService } from '../record/record.service';
import { AnalysisResponseDto } from './dto/analysis-response.dto';

@Injectable()
export class AnalysisService {
  private openai: OpenAI;

  constructor(
    private readonly config: ConfigService,
    private readonly recordService: RecordService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'),
    });
  }

  async analyzeImage(imageBuffer: Buffer, userId: string): Promise<AnalysisResponseDto> {
    const base64Image = imageBuffer.toString('base64');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 음식 영양 분석 전문가입니다. 사진에 보이는 음식을 분석하여 반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.
{
  "name": "음식 이름 (한국어)",
  "mealType": "아침/점심/저녁/간식 중 추정",
  "calories": 숫자,
  "carbs": 탄수화물(g),
  "protein": 단백질(g),
  "fat": 지방(g),
  "sodium": 나트륨(mg),
  "tip": "이 음식에 대한 한 줄 영양 팁 (한국어)"
}`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: '이 음식의 칼로리와 영양 성분을 분석해주세요.' },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new BadRequestException('AI 분석에 실패했습니다');

    let parsed: any;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error();
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      throw new BadRequestException('AI 응답을 파싱할 수 없습니다');
    }

    const remaining = await this.recordService.getRemainingCalories(userId);
    const goalPercent = remaining > 0
      ? Math.round((parsed.calories / (remaining + parsed.calories)) * 100)
      : 100;

    return {
      name: parsed.name,
      mealType: `${parsed.mealType} 식사로 감지됨`,
      calories: parsed.calories,
      carbs: parsed.carbs,
      protein: parsed.protein,
      fat: parsed.fat,
      sodium: parsed.sodium,
      remainingCalories: remaining,
      goalPercent,
      tip: parsed.tip,
    };
  }
}
