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
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import {
  CreateSpaceDto,
  CreateSpacesQuotaDto,
} from './dto/create-spaces-quota.dto';
import {
  UpdateSpaceDto,
  UpdateSpacesQuotaDto,
} from './dto/update-spaces-quota.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { fileStorageRootDir, oneMB } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FileUploadResponseDto } from './dto/file-upload-response';
import { FileUploadDto } from './dto/file-upload.dto';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from 'src/users/users.schema';
import { Public } from 'src/auth/public.decorator';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';


@Controller('spaces')
export class SpacesController {
  constructor(private readonly service: SpacesService) {}


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
