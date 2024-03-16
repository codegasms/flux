import { Injectable } from '@nestjs/common';
import { CreateModDto } from './dto/create-mod.dto';
import { UpdateModDto } from './dto/update-mod.dto';

@Injectable()
export class ModsService {
  create(createModDto: CreateModDto) {
    return 'This action adds a new mod';
  }

  findAll() {
    return `This action returns all mods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mod`;
  }

  update(id: number, updateModDto: UpdateModDto) {
    return `This action updates a #${id} mod`;
  }

  remove(id: number) {
    return `This action removes a #${id} mod`;
  }
}
