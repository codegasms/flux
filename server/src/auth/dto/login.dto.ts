import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SingInDto {
  @IsEmail()
  email: string;

  @Length(8, 72)
  @IsNotEmpty()
  password: string;
}
