import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-github';
import { oauthConfig } from '../config';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: oauthConfig.github.clientID,
      clientSecret: oauthConfig.github.clientSecret,
      callbackURL: oauthConfig.github.callbackUrl,
      scope: oauthConfig.github.scopes,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(profile);

    done(null, profile);
  }
}
