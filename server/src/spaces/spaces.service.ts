import { Injectable } from '@nestjs/common';
import {
  CreateSpaceDto,
  CreateSpacesQuotaDto,
} from './dto/create-spaces-quota.dto';
import {
  UpdateSpaceDto,
  UpdateSpacesQuotaDto,
} from './dto/update-spaces-quota.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { FileObject, FileObjectDocument } from './files.schema';
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
