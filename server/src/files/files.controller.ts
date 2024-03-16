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
} from '@nestjs/common';
import { FilesService } from './files.service';
import { UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from 'src/users/users.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { diskStorage } from 'multer';
import { fileStorageRootDir, oneMB } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ApiOperation } from '@nestjs/swagger';
import { FileUploadResponseDto } from './dto/file-upload-response';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: fileStorageRootDir,
        filename: (request, file, cb) => {
          const fileUuid = uuidv4();
          const parts = file.originalname.split('.');
          const fileExt = parts.pop();
          const newFileName =
            parts.join('.').replace(' ', '_') + '_' + fileUuid + '.' + fileExt;
          cb(null, newFileName);
        },
      }),
    }),
  )
  @ApiOperation({
    summary: 'Upload a file',
    description:
      'You will get fileName in response when you successfully upload a file.\nTo directly access the uploaded file hit /files/{fileName}',
  })
  async uploadFile(
    @Request() request,
    @Body() data: FileUploadDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * oneMB })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<FileUploadResponseDto> {
    return await this.filesService.create({
      meta: {
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
      fileName: file.filename,
      purpose: data.purpose,
      uploadedOn: new Date(),
      uploader: request.permissions['_id'],
    });
  }

  @Get()
  @Roles()
  async findAll() {
    return this.filesService.findAll();
  }

  @Public()
  @Get('stream/:filename')
  @ApiOperation({ summary: 'Stream/download a file' })
  async getFile(@Param('filename') filename: string): Promise<StreamableFile> {
    console.log(filename);
    const fileObject = this.filesService.findOne(filename);
    const file = createReadStream(
      join(fileStorageRootDir, (await fileObject).fileName),
    );
    return new StreamableFile(file);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
