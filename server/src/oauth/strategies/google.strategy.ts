import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { oauthConfig } from '../config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: oauthConfig.google.clientID,
      clientSecret: oauthConfig.google.clientSecret,
      callbackURL: oauthConfig.google.callbackUrl,
      scope: oauthConfig.google.scopes,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };
    console.log(user);
    done(null, user);
  }
}

// cb
// http://localhost:3000/oauth/google/callback
