import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { AuthGuard } from 'passport-google-oauth2';
@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
    });
  }
}
