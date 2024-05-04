import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SingInDto {
  @IsEmail()
  @ApiProperty({ default: 'daw@aahnik.dev' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'hello void' })
  password: string;
}
