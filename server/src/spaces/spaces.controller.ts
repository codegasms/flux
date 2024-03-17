import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Request,
  StreamableFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { CreateSpacesQuotaDto } from './dto/create-spaces-quota.dto';
import { UpdateSpacesQuotaDto } from './dto/update-spaces-quota.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { fileStorageRootDir, multerOptions, oneMB } from './constants';

import { createReadStream, fstat } from 'fs';
import { join } from 'path';
import { FileUploadResponseDto } from './dto/file-upload-response';
import { FileUploadDto } from './dto/file-upload.dto';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from 'src/users/users.schema';
import { Public } from 'src/auth/public.decorator';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';

@ApiBearerAuth()
@ApiTags('spaces')
@Controller('spaces')
export class SpacesController {
  constructor(private readonly service: SpacesService) {}

  /*
   * endpoints related to files upload and access
   */

  @Post('create/:spacePath')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      // multerOptions
    ),
  )
  @ApiOperation({
    summary: 'Create a directory or upload files',
    description:
      'The files array can be empty, to create a directory with the name of spacePath. If there are single or multiple files, then spacePath is the directory where these files live.',
  })
  async createFile(
    @Request() request,
    @Param('spacePath') spacePath: string,
    @Body() data: FileUploadDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    console.log(files);
    console.log(request.permissions._id);
    console.log(spacePath);

    const now = new Date();
    if (files.length == 0) {
      console.log('no files received, create a dir');
      return await this.service.createFile({
        spacePath: spacePath,
        isDir: true,
        created: now,
        owner: request.permissions._id,
      });
    }

    const createdFiles = [];
    for (const file of files) {
      const virtualPath = path.join(spacePath, file.originalname);
      console.log(virtualPath);
      const createdFile = await this.service.createFile({
        mimeType: file.mimetype,
        size: file.size,
        spacePath: virtualPath,
        created: now,
        lastEdited: now,
        owner: request.permissions._id,
      });
      createdFiles.push(createdFile);
      const diskPath = path.join(fileStorageRootDir, String(createdFile._id));
      await writeFile(diskPath, file.buffer);
    }

    return createdFiles;
  }

  @Post('share/:spacePath')
  @ApiOperation({
    summary: 'Share a file with others.',
    description: 'You change the editors and viewers of current file',
  })
  async shareFile(@Param('spacePath') spacePath: string) {}

  @Patch('trash/:spacePath')
  @ApiOperation({
    summary:
      'Send a directory and all its subdirectories and files within them to trash',
  })
  async moveToTrash(@Param('spacePath') spacePath: string) {}
  // @Get('fetch/:filename')
  // @ApiOperation({ summary: 'Stream/download a file' })
  // async getFile(@Param('filename') filename: string): Promise<StreamableFile> {
  //   console.log(filename);
  //   const fileObject = this.service.findFile(filename);
  //   // check if current user is owner or has access
  //   const file = createReadStream(
  //     join(fileStorageRootDir, (await fileObject).fileName),
  //   );
  //   return new StreamableFile(file);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.service.remove(id);
  // }

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
