import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SingInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
