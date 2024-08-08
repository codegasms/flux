import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/auth/public.decorator';
import { OAuthProvider } from 'src/users/dto/find-or-create-user.dto';
import { UsersService } from 'src/users/users.service';
import { oauthConfig } from './config';
import { GithubOauthGuard } from './guards/github-oauth.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { OauthService } from './oauth.service';

@ApiTags('oauth')
@Public()
@Controller('oauth')
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleOAuth() { }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleOAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(req.user);
    const user = await this.usersService.findOrCreate({
      provider: req.user.provider,
      providerId: req.user.providerId,
      fullName: req.user.name,
      email: req.user.email,
    });

    const token = await this.authService.generateJwtToken(user.email);
    res.cookie('accessToken', token, {
      sameSite: 'none',
    });

    return res.redirect(oauthConfig.frontendUrl);
  }

  @Get('github')
  @UseGuards(GithubOauthGuard)
  async githubOAuth() { }

  @Get('github/callback')
  @UseGuards(GithubOauthGuard)
  async githubOAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(req.user);
    const user = await this.usersService.findOrCreate({
      provider: OAuthProvider.github,
      providerId: req.user.id,
      fullName: req.user.displayName,
      email: req.user.emails[0].value,
    });
    const token = await this.authService.generateJwtToken(user.email);
    res.cookie('accessToken', token, {
      sameSite: 'none',
    });
    return res.redirect(oauthConfig.frontendUrl);
  }
}
