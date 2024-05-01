export class UserAccountOutDto {
  email: string;
  role: string;
  joined: Date;
  lastLogin: Date;
  isActive: boolean;
  modTokensRemaining: number;
  spacesQuota: string;
}
