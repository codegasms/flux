import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { GithubOauthGuard } from './guards/github-oauth.guard';

@ApiTags('oauth')
@Public()
@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleOAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleOAuthCallback(@Req() req) {
    console.log(req.user);

    return req.user;
  }

  @Get('github')
  @UseGuards(GithubOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubOAuth() {}

  @Get('github/callback')
  @UseGuards(GithubOauthGuard)
  async githubOAuthCallback(@Req() req) {
    console.log(req.user);

    return req.user;
  }
}
