import { UserProfile } from '../entities/user-profile.entity';

export class UpdateUserAccountDto {
  fullName: string;
  role: string;
  isActive: boolean;
  modTokensRemaining: number;
  spacesQuota: string;
  profile: UserProfile;
}
