import { Injectable } from '@nestjs/common';
import { FileObject, FileObjectDocument } from './files.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileObject.name) private model: Model<FileObjectDocument>,
  ) {}
  async create(createFileDto: CreateFileDto): Promise<FileObject> {
    const createdFileObject = new this.model(createFileDto);
    return await createdFileObject.save();
  }

  async findAll() {
    return `This action returns all files`;
  }

  async findOne(fileName: string): Promise<FileObject> {
    return await this.model.findOne({ fileName: fileName });
  }

  async remove(filename: string) {
    return `This action removes a #${filename} file`;
  }
}
