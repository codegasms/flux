import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  PreconditionFailedException,
} from '@nestjs/common';
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
import {
  isSpaceRoot,
  joinSpacePath,
  splitSpacePath,
  trimSlashes,
} from 'src/utils/space-paths';
import { SpacePath } from './dto/space-path.dto';
import { CopyFileDto } from './dto/copy-file.dto';
import { MoveFileDto } from './dto/move-file.dto';
import * as path from 'path';
import * as fs from 'node:fs/promises';
import { fileStorageRootDir } from './constants';
import { IFileObjectQuery } from './entities/file-object-query.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SpacesService {
  constructor(
    private usersService: UsersService,
    @InjectModel(FileObject.name) private filesModel: Model<FileObjectDocument>,
    @InjectModel(SpaceQuotas.name)
    private spacesQuotaModel: Model<SpaceQuotasDocument>,
  ) {}

  async assureDirExists(ownerID: string, spacePath: SpacePath): Promise<void> {
    // assert whether the given spacePath is a valid directory in the owner's space
    if (spacePath.spaceParent === '/' && spacePath.fileName === '') return;
    const parentDir = await this.filesModel.findOne({
      owner: ownerID,
      spaceParent: spacePath.spaceParent,
      fileName: spacePath.fileName,
      isDir: true,
    });
    if (!parentDir)
      throw new ForbiddenException(
        `Directory ${path.join(spacePath.spaceParent, spacePath.fileName)} does not exist.`,
      );
  }

  async assureFileDoesNotExist(
    ownerID: string,
    spacePath: SpacePath,
  ): Promise<void> {
    let isRoot = false;
    let fileObj = null;
    if (spacePath.spaceParent === '/' && spacePath.fileName === '') {
      isRoot = true;
    } else {
      fileObj = await this.filesModel.findOne({
        owner: ownerID,
        spaceParent: spacePath.spaceParent,
        fileName: spacePath.fileName,
      });
    }

    if (fileObj || isRoot)
      throw new ForbiddenException(
        `Object ${path.join(spacePath.spaceParent, spacePath.fileName)} already exists`,
      );
  }

  async fetchUsage(ownerId: string, spacePath: SpacePath) {
    const match = {
      isDir: false,
      inTrash: false,
    };
    if (!isSpaceRoot(spacePath)) {
      match['spaceParent'] = startsWith(joinSpacePath(spacePath));
    }
    return await this.filesModel.aggregate([
      {
        $match: match,
      },
      {
        $group: { _id: '$mimeType', totalSize: { $sum: '$size' } },
      },
    ]);
  }

  async createFile(createFileDto: CreateFileDto): Promise<FileObject> {
    await this.assureDirExists(
      createFileDto.owner,
      splitSpacePath(createFileDto.spaceParent),
    );

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

  async findMeta(
    ownerId: string,
    spacePath: SpacePath,
    inTrash: boolean = false,
  ) {
    const query: IFileObjectQuery = {
      owner: ownerId,
      spaceParent: spacePath.spaceParent,
      inTrash: inTrash,
    };
    // when spacePath is root, skip adding fileName to query
    if (isSpaceRoot(spacePath)) {
      return await this.filesModel.find({ ...query }).exec();
    }
    query['fileName'] = spacePath.fileName;
    const fileObj = await this.filesModel.findOne({ ...query });
    if (!fileObj)
      throw new NotFoundException('No such file or directory found');
    if (fileObj.isDir) {
      delete query['fileName'];
      query['spaceParent'] = startsWith(joinSpacePath(spacePath));
      const children = await this.filesModel.find({ ...query }).exec();
      return [fileObj, ...children];
    }
    return fileObj;
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

  // moveToTrash and recoverFromTrash can have potential conflicts with same file poth in complement, which complementation is caused
  // think how to handle this

  async moveToTrash(ownerId: string, spacePath: SpacePath) {
    const fileObj = await this.filesModel.findOne({
      owner: ownerId,
      spaceParent: spacePath.spaceParent,
      fileName: spacePath.fileName,
      inTrash: false,
    });
    if (!fileObj) {
      throw new PreconditionFailedException(
        'No such item exists outside trash',
      );
    }

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

  async recoverFromTrash(ownerId: string, spacePath: SpacePath) {
    const fileObj = await this.filesModel.findOne({
      owner: ownerId,
      spaceParent: spacePath.spaceParent,
      fileName: spacePath.fileName,
      inTrash: true,
    });
    if (!fileObj) {
      throw new PreconditionFailedException('No such item exists in trash');
    }

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
      fileObj.inTrash = false;
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
      const { spaceParent, fileName } = splitSpacePath(fileObj.spaceParent);
      console.log(spaceParent);
      console.log(fileName);
      fileObj = await this.filesModel.findOne({
        spaceParent: spaceParent,
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
    const fileObj = await this.filesModel.findOne({
      owner: ownerId,
      spaceParent: copyFileDto.spaceParent,
      fileName: copyFileDto.fileName,
    });
    if (fileObj.isDir) {
      throw new NotImplementedException(
        'Copying directories is not currently supported!',
      );
    }
    this.assureDirExists(ownerId, splitSpacePath(copyFileDto.destinationDir));
    const now = new Date();
    const copiedFileObj = new this.filesModel({
      spaceParent: copyFileDto.destinationDir,
      fileName: fileObj.fileName,
      size: fileObj.size,
      mimeType: fileObj.mimeType,
      created: now,
      lastEdited: now,
      owner: ownerId,
    });

    const cpFileObj = await copiedFileObj.save();
    await fs.copyFile(
      path.join(fileStorageRootDir, fileObj.id),
      path.join(fileStorageRootDir, cpFileObj.id),
    );
    await this.usersService.consumeStorageSpace(ownerId, fileObj.size);
    return cpFileObj;
  }

  async moveFile(ownerId: string, moveFileDto: MoveFileDto) {
    console.log(ownerId);
    console.log(moveFileDto);
    const fileObj = await this.filesModel.findOne({
      owner: ownerId,
      spaceParent: moveFileDto.sourcePath.spaceParent,
      fileName: moveFileDto.sourcePath.fileName,
    });
    await this.assureDirExists(
      ownerId,
      splitSpacePath(moveFileDto.destPath.spaceParent),
    );
    await this.assureFileDoesNotExist(ownerId, moveFileDto.destPath);
    // the fileObj will be moved under new parent folder
    // moveFileDto.destPath.spaceParent
    // as name
    // moveFileDto.destPath.fileName
    if (fileObj.isDir) {
      console.log('to move is a dir');
      const oldParentPath = trimSlashes(joinSpacePath(moveFileDto.sourcePath));
      const newParentPath = trimSlashes(joinSpacePath(moveFileDto.destPath));
      console.log(oldParentPath);
      console.log(newParentPath);
      const children = await this.filesModel
        .find({
          owner: ownerId,
          spaceParent: startsWith(oldParentPath),
        })
        .exec();
      console.log('children');
      for (const fileObjItem of children) {
        console.log(fileObjItem.fileName);
        fileObjItem.spaceParent = fileObjItem.spaceParent.replace(
          oldParentPath,
          newParentPath,
        );
        await fileObjItem.save();
      }
    }
    fileObj.spaceParent = moveFileDto.destPath.spaceParent;
    fileObj.fileName = moveFileDto.destPath.fileName;
    return await fileObj.save();
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
