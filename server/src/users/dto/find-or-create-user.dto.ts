export enum OAuthProvider {
  google = 'google',
  github = 'github',
}

export class FindOrCreateUserDto {
  provider: OAuthProvider;
  providerId: string; // user's id in google or github
  fullName: string;
  email: string;
}
