import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User, UserDocument } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPermsOutDto } from './dto/user-perms-out.dto';
import { UserProfileOutDto } from './dto/user-profile-out.dto';
import { UserAccountOutDto } from './dto/user-account-out.dto';
import { StorageSpaceDto } from './dto/storage-space.dto';
// import { UpdateUserAccountDto } from './dto/update-user-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private model: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.model(createUserDto);
    return await createdUser.save();
  }

  async findAll() {
    return await this.model.find().exec();
  }

  async findOneById(
    id: string,
    project: string = 'profile',
  ): Promise<User | undefined> {
    return await this.model.findById(id, project);
  }

  async findIDFromEmail(email: string): Promise<string> {
    const user = await this.model.findOne({ email: email });
    return String(user._id);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.model.findOne({ email: email });
  }

  async findPermissions(email: string): Promise<UserPermsOutDto | undefined> {
    return await this.model.findOne({ email: email }).select('role isActive');
  }

  async findProfile(id: string): Promise<UserProfileOutDto | undefined> {
    return await this.model.findById(id, {
      projection: 'profile',
    });
  }

  async updateProfile(
    id: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfileOutDto | undefined> {
    return await this.model.findByIdAndUpdate(id, updateUserProfileDto, {
      projection: 'profile',
    });
    // TODO: project so that only needed things come
    // dto based easy writing of projections figure out
  }

  async findAccount(id: string): Promise<UserAccountOutDto | undefined> {
    return await this.model.findById(id, '-profile -hashedPassword');
  }

  // async updateAccount(
  //   id: string,
  //   updateAccountDto: UpdateUserAccountDto,
  // ): Promise<UserAccountOutDto | undefined> {
  //   return await this.model.findByIdAndUpdate(id, updateAccountDto, {
  //     upsert: true,
  //     projection: '-profile -hashedPassword',
  //   });
  // }

  // update email and update username
  async remove(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  // users spaces
  async consumeStorageSpace(ownerId: string, size: number) {
    const user = await this.model.findById(ownerId);
    if (!user)
      throw new NotFoundException(
        "Failed to change user's storage space consumption! User not found",
      );
    user.storageUsed += size;
    if (user.storageUsed < 0)
      throw new BadRequestException('Storage used can not be negative!');
    await user.save();
  }

  async freeStorageSpace(ownerId: string, size: number) {
    await this.consumeStorageSpace(ownerId, -1 * size);
  }

  async findStorageSpace(ownerId: string): Promise<StorageSpaceDto> {
    const user = await this.model.findById(ownerId);
    return { used: user.storageUsed };
  }
}
