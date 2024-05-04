import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ default: 'daw@aahnik.dev' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'Void' })
  fullName: string;

  @Length(8, 72)
  @ApiProperty({ default: 'hello void' })
  @IsNotEmpty()
  password: string;
}
