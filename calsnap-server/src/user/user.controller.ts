import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @ApiOperation({ summary: '내 프로필 조회' })
  async getProfile(@Request() req: any) {
    const user = await this.userService.findById(req.user.id);
    const { password, refreshToken, ...profile } = user as any;
    return profile;
  }

  @Patch('me')
  @ApiOperation({ summary: '프로필 수정 (이름, 신체정보, 활동량)' })
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    const user = await this.userService.updateProfile(req.user.id, dto);
    const { password, refreshToken, ...profile } = user as any;
    return profile;
  }

  @Patch('me/goal')
  @ApiOperation({ summary: '목표 칼로리/유형 수정' })
  async updateGoal(@Request() req: any, @Body() dto: UpdateGoalDto) {
    const user = await this.userService.updateGoal(req.user.id, dto);
    const { password, refreshToken, ...profile } = user as any;
    return profile;
  }

  @Delete('me')
  @ApiOperation({ summary: '회원 탈퇴' })
  async deleteAccount(@Request() req: any) {
    await this.userService.remove(req.user.id);
    return { message: '계정이 삭제되었습니다' };
  }
}
