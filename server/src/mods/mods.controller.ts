import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModsService } from './mods.service';
import { CreateModDto } from './dto/create-mod.dto';
import { UpdateModDto } from './dto/update-mod.dto';

@Controller('mods')
export class ModsController {
  constructor(private readonly modsService: ModsService) {}

  @Post()
  create(@Body() createModDto: CreateModDto) {
    return this.modsService.create(createModDto);
  }

  @Get()
  findAll() {
    return this.modsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModDto: UpdateModDto) {
    return this.modsService.update(+id, updateModDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modsService.remove(+id);
  }
}
