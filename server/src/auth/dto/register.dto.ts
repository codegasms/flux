import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  fullName: string;

  @Length(8, 72)
  @IsNotEmpty()
  password: string;
}
