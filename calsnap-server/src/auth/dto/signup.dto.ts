import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  password: string;

  @ApiProperty({ example: '홍길동' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name: string;
}
