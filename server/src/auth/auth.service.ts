import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { saltRounds } from './constants';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailer: MailerService,
  ) {}

  async login(email: string, password: string): Promise<SignInResponseDto> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const match = await bcrypt.compare(password, user?.hashedPassword);

    if (!match) {
      throw new UnauthorizedException("Password or email doesn't match");
    }

    user.lastLogin = new Date();
    await user.save();

    await this.mailer.sendTemplateMail({
      templateType: 'login',
      recipients: [email],
      subject: 'Flux@Codegasms New Login Detected',
      username: user.fullName,
    });

    return {
      access_token: await this.generateJwtToken(email),
    };
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    const user = await this.usersService.create({
      email: registerDto.email,
      fullName: registerDto.fullName,
      hashedPassword: hashedPassword,
    });

    await this.mailer.sendTemplateMail({
      templateType: 'register',
      recipients: [user.email],
      subject: 'Welcome to Flux@Codegasms',
      username: user.fullName,
    });

    return {
      access_token: await this.generateJwtToken(user.email),
    };
  }

  async generateJwtToken(email: string) {
    return await this.jwtService.signAsync({ sub: email });
  }
}
