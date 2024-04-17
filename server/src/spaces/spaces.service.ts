import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateSpacesQuotaDto } from './dto/create-spaces-quota.dto';
import { UpdateSpacesQuotaDto } from './dto/update-spaces-quota.dto';
import { CreateFileDto } from './dto/create-file.dto';
import {
  FileObject,
  FileObjectDocument,
  SpaceQuotas,
  SpaceQuotasDocument,
} from './spaces.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ShareFileDto } from './dto/share-file-dto';
import { startsWith } from 'src/utils/regex';
import { splitSpacePath } from 'src/utils/space-paths';
import { SpacePath } from './dto/space-path.dto';
import { CopyFileDto } from './dto/copy-file.dto';
import { MoveFileDto } from './dto/move-file.dto';

@Injectable()
export class SpacesService {
  constructor(
    @InjectModel(FileObject.name) private filesModel: Model<FileObjectDocument>,
    @InjectModel(SpaceQuotas.name)
    private spacesQuotaModel: Model<SpaceQuotasDocument>,
  ) {}

  async createFile(createFileDto: CreateFileDto): Promise<FileObject> {
    const { sParent, fileName } = splitSpacePath(createFileDto.spaceParent);
    console.log('***** in createFile service');
    console.log(sParent);
    console.log(fileName);
    if (sParent == '/' && !fileName) {
      // creation of new stuff in root dir
      console.log('creating stuff in root dir');
    } else {
      const parentDir = await this.filesModel.findOne({
        spaceParent: sParent,
        fileName: fileName,
        isDir: true,
      });
      if (!parentDir)
        throw new ForbiddenException('Parent Directory does not exist');
    }

    const existingFileObject = await this.filesModel.findOne({
      spaceParent: createFileDto.spaceParent,
      fileName: createFileDto.fileName,
    });

    if (existingFileObject && existingFileObject.isDir)
      throw new ForbiddenException('Directory already exists with same name');
    else if (existingFileObject) {
      let i: number = 1;
      while (true) {
        const attempt = createFileDto.fileName + `(${i})`;
        const existingAttempt = await this.filesModel.findOne({
          spaceParent: createFileDto.spaceParent,
          fileName: attempt,
        });
        if (existingAttempt) {
          i++;
          continue;
        }
        createFileDto.fileName = attempt;
        break;
      }
    }
    const createdFileObject = new this.filesModel(createFileDto);
    return await createdFileObject.save();
  }

  async findMeta(ownerId: string, spacePath: SpacePath) {
    const query = {
      owner: ownerId,
      spaceParent: spacePath.spaceParent,
      inTrash: false,
    };
    if (spacePath.fileName !== '/') query['fileName'] = spacePath.fileName;

    return await this.filesModel.find({ ...query }).exec();
  }

  async shareFile(ownerId: string, shareFileDto: ShareFileDto) {
    return await this.filesModel.findOneAndUpdate(
      {
        owner: ownerId,
        spaceParent: shareFileDto.spaceParent,
        fileName: shareFileDto.fileName,
      },
      { ...shareFileDto },
    );
  }

  async moveToTrash(ownerId: string, spacePath: SpacePath) {
    const fileObj = await this.filesModel.findOne({
      owner: ownerId,
      spaceParent: spacePath.spaceParent,
      fileName: spacePath.fileName,
    });

    if (fileObj.isDir) {
      const children = await this.filesModel
        .find({
          owner: ownerId,
          spaceParent: startsWith(spacePath.spaceParent),
        })
        .exec();
      for (const fileObjItem of children) {
        fileObjItem.inTrash = true;
        await fileObjItem.save();
      }
    } else {
      fileObj.inTrash = true;
      await fileObj.save();
    }
  }

  async checkReadPerms(
    userId: string,
    fileId: string,
    isDir: boolean,
  ): Promise<string | null> {
    let fileObj = await this.filesModel.findOne({
      _id: fileId,
      isDir: isDir,
      inTrash: false,
    });
    console.log(fileObj);
    if (
      fileObj.owner === userId ||
      fileObj.viewers.includes(userId) ||
      fileObj.editors.includes(userId)
    )
      return fileObj.fileName;

    // check parent dirs for access
    const actualName = fileObj.fileName;
    console.log('checking parent dires for acc');
    while (fileObj.spaceParent != '/') {
      const { sParent, fileName } = splitSpacePath(fileObj.spaceParent);
      console.log(sParent);
      console.log(fileName);
      fileObj = await this.filesModel.findOne({
        spaceParent: sParent,
        fileName: fileName,
        isDir: true,
        inTrash: false,
      });
      console.log(fileObj);
      if (fileObj.viewers.includes(userId) || fileObj.editors.includes(userId))
        return actualName;
    }
    return null;
  }

  async copyFile(ownerId: string, copyFileDto: CopyFileDto) {
    console.log(ownerId);
    console.log(copyFileDto);
    return 'done';
  }

  async moveFile(ownerId: string, moveFileDto: MoveFileDto) {
    console.log(ownerId);
    console.log(moveFileDto);
    return 'done';
  }

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
    );
  }

  async removeSpacesQuota(quotaID: string) {
    return await this.spacesQuotaModel.findOneAndDelete({ quotaID: quotaID });
  }
}
