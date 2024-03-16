import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User, UserDocument } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPermsOutDto } from './dto/user-perms-out.dto';
import { UserProfileOutDto } from './dto/user-profile-out.dto';
import { UserAccountOutDto } from './dto/user-account-out.dto';
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

  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.model.findOne({ username: username });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.model.findOne({ email: email });
  }

  async findPermissions(
    username: string,
  ): Promise<UserPermsOutDto | undefined> {
    return await this.model
      .findOne({ username: username })
      .select('role isSuperUser isStaff');
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
      upsert: true,
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
}
