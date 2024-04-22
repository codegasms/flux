import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthController } from './oauth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';

@Module({
  controllers: [OauthController],
  providers: [OauthService, GoogleStrategy, GitHubStrategy],
})
export class OauthModule {}
