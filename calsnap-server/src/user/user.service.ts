import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다');
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    await this.findById(id);
    await this.userRepo.update(id, dto);
    return this.findById(id);
  }

  async updateGoal(id: string, dto: UpdateGoalDto): Promise<User> {
    await this.findById(id);
    await this.userRepo.update(id, dto);
    return this.findById(id);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.userRepo.update(id, { refreshToken });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepo.remove(user);
  }
}
