import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  Res,
  Request,
  StreamableFile,
  UseInterceptors,
  UploadedFiles,
  UnauthorizedException,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { CreateSpacesQuotaDto } from './dto/create-spaces-quota.dto';
import { UpdateSpacesQuotaDto } from './dto/update-spaces-quota.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { fileStorageRootDir } from './constants';

import { createReadStream } from 'fs';
import { join } from 'path';
import { FileUploadDto } from './dto/file-upload.dto';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from 'src/users/users.schema';
import { Public } from 'src/auth/public.decorator';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import { ShareFileDto } from './dto/share-file-dto';
import { splitSpacePath, trimSlashes } from 'src/utils/space-paths';

@ApiBearerAuth()
@ApiTags('spaces')
@Controller('spaces')
export class SpacesController {
  constructor(private readonly service: SpacesService) {}

  /*
   * endpoints related to files upload and access
   */

  @Post('create/:spaceParent')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({
    summary: 'Create a directory or upload files',
    description:
      'The files array can be empty, to create a directory with the name of spacePath. If there are single or multiple files, then spacePath is the directory where these files live.',
  })
  async createFile(
    @Request() request,
    @Param('spaceParent') spaceParent: string,
    @Body() data: FileUploadDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    console.log(files);
    console.log(request.permissions._id);
    spaceParent = trimSlashes(spaceParent);
    console.log(spaceParent);

    const now = new Date();
    if (files.length == 0) {
      console.log('no files received, create a dir');

      const { sParent, fileName } = splitSpacePath(spaceParent);
      return await this.service.createFile({
        spaceParent: sParent,
        fileName: fileName,
        isDir: true,
        created: now,
        owner: request.permissions._id,
      });
    }

    const createdFiles = [];
    for (const file of files) {
      const createdFile = await this.service.createFile({
        mimeType: file.mimetype,
        size: file.size,
        spaceParent: spaceParent,
        fileName: file.originalname,
        created: now,
        lastEdited: now,
        owner: request.permissions._id,
      });
      createdFiles.push(createdFile);
      console.log(createdFile._id);
      const diskPath = path.join(fileStorageRootDir, String(createdFile._id));
      await writeFile(diskPath, file.buffer);
    }

    return createdFiles;
  }

  /*
  file access logic
  if request for path then  search in self drive, and check that path
  if request for id then search by id and check access
  */

  @Post('share/:spaceParent/:fileName')
  @ApiOperation({
    summary: 'Share a file with others.',
    description: 'You change the editors and viewers of current file',
  })
  async shareFile(
    @Request() request,
    @Param('spaceParent') spaceParent: string,
    @Param('fileName') fileName: string,
    @Body() shareFileDto: ShareFileDto,
  ) {
    spaceParent = trimSlashes(spaceParent);
    await this.service.shareFile(
      String(request.permissions._id),
      spaceParent,
      fileName,
      shareFileDto,
    );
  }

  @Patch('trash/:spaceParent/:fileName')
  @ApiOperation({
    summary:
      'Send a directory and all its subdirectories and files within them to trash',
  })
  async moveToTrash(
    @Request() request,
    @Param('spaceParent') spaceParent: string,
    @Param('fileName') fileName: string,
  ) {
    spaceParent = trimSlashes(spaceParent);
    return await this.service.moveToTrash(
      String(request.permissions._id),
      spaceParent,
      fileName,
    );
  }

  @Get('meta/:spaceParent/:fileName')
  @ApiOperation({
    summary: 'Get metadata about a file or directory in user space',
  })
  async getMeta(
    @Request() request,
    @Param('spaceParent') spaceParent?: string,
    @Param('fileName') fileName?: string,
  ) {
    spaceParent = trimSlashes(spaceParent);
    return await this.service.findMeta(
      String(request.permissions._id),
      spaceParent,
      fileName,
    );
  }

  @Get('stream/:fileID')
  @ApiOperation({
    summary: 'Stream a file by ID if user has access',
  })
  @Header('Content-Type', 'application/octet-stream')
  async streamFile(
    @Request() request,
    @Param('fileID') fileID: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const canRead = await this.service.checkReadPerms(
      String(request.permissions._id),
      fileID,
      false,
    );
    console.log(canRead);

    if (!canRead) throw new UnauthorizedException();

    const file = createReadStream(join(fileStorageRootDir, fileID));
    res.set({
      'Content-Disposition': `attachment; filename="${canRead}"`,
    });
    return new StreamableFile(file);
  }

  /*
   * endpoints related to spaces quota
   */

  @Public()
  @Get('/quotas')
  @ApiOperation({ summary: 'Get list of all space quotas availaible.' })
  async findAllSpaceQuotas() {
    return await this.service.findAllSpaceQuotas();
  }

  @Public()
  @Get('/quotas/:quotaID')
  @ApiOperation({ summary: 'Get all details of a specific spaces quota.' })
  async findSpacesQuota(@Param('quotaID') quotaID: string) {
    return await this.service.findSpacesQuota(quotaID);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Post('/quotas/:quotaID')
  @ApiOperation({ summary: 'Create a new spaces quota' })
  createSpacesQuota(
    @Param('quotaID') quotaID: string,
    @Body() createSpacesQuotaDto: CreateSpacesQuotaDto,
  ) {
    return this.service.createSpacesQuota(quotaID, createSpacesQuotaDto);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Patch('/quotas/:quotaID')
  @ApiOperation({ summary: 'Update and existing spaces quota' })
  updateSpacesQuota(
    @Param('quotaID') quotaID: string,
    @Body() updateSpacesQuotaDto: UpdateSpacesQuotaDto,
  ) {
    return this.service.updateSpacesQuota(quotaID, updateSpacesQuotaDto);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Delete('/quotas/:quotaID')
  @ApiOperation({ summary: 'Remove an existing spaces quota' })
  removeSpacesQuota(@Param('quotaID') quotaID: string) {
    return this.service.removeSpacesQuota(quotaID);
  }
}
