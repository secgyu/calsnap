import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }

  async signup(dto: SignupDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('이미 등록된 이메일입니다');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    const tokens = await this.generateTokens(user.id, user.email);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findById(payload.sub);
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다');
      }

      const tokens = await this.generateTokens(user.id, user.email);
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다');
    }
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, refreshToken, ...result } = user;
    return result;
  }
}
