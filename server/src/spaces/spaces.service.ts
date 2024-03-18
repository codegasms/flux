import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateSpacesQuotaDto } from './dto/create-spaces-quota.dto';
import { UpdateSpacesQuotaDto } from './dto/update-spaces-quota.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { FileObject, FileObjectDocument } from './spaces.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SpaceQuotas, SpaceQuotasDocument } from './spaces.schema';

@Injectable()
export class SpacesService {
  constructor(
    @InjectModel(FileObject.name) private filesModel: Model<FileObjectDocument>,
    @InjectModel(SpaceQuotas.name)
    private spacesQuotaModel: Model<SpaceQuotasDocument>,
  ) {}

  async createFile(createFileDto): Promise<FileObject> {
    const existingFileObject = await this.filesModel.findOne({
      spacePath: createFileDto.spacePath,
    });

    if (existingFileObject && existingFileObject.isDir)
      throw new ForbiddenException('Directory exists with same name');
    else if (existingFileObject) {
      let i: number = 1;
      while (true) {
        const attempt = createFileDto.spacePath + `(${i})`;
        const existingAttempt = await this.filesModel.findOne({
          spacePath: attempt,
        });
        if (existingAttempt) {
          i++;
          continue;
        }
        createFileDto.spacePath = attempt;
        break;
      }
    }
    const createdFileObject = new this.filesModel(createFileDto);
    return await createdFileObject.save();
  }

  async findMeta(userId: string, spacePath: string) {
    const regexp = new RegExp('^', spacePath);
    return await this.filesModel
      .find({ owner: userId, spacePath: regexp })
      .exec();
  }
  async findFile(filename) {}

  async findAllSpaceQuotas() {
    return await this.spacesQuotaModel.find().exec();
  }

  async findSpacesQuota(quotaID: string) {
    return await this.spacesQuotaModel.findOne({ quotaID: quotaID });
  }

  async createSpacesQuota(
    quotaID: string,
    createSpacesQuotaDto: CreateSpacesQuotaDto,
  ) {
    const createdSpacesQuota = new this.spacesQuotaModel({
      quotaID: quotaID,
      ...createSpacesQuotaDto,
    });
    return await createdSpacesQuota.save();
  }

  async updateSpacesQuota(
    quotaID: string,
    updateSpacesQuotaDto: UpdateSpacesQuotaDto,
  ) {
    return await this.spacesQuotaModel.findOneAndUpdate(
      { quotaID: quotaID },
      updateSpacesQuotaDto,
      { upsert: true },
    );
  }

  async removeSpacesQuota(quotaID: string) {
    return await this.spacesQuotaModel.findOneAndDelete({ quotaID: quotaID });
  }
}
