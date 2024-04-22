import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { ModsService } from './mods.service';
import { CreateModDto } from './dto/create-mod.dto';
import { UpdateModDto } from './dto/update-mod.dto';
import { ApplyModDto } from './dto/apply-mod.dto';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { CreateTokenPlanDto } from './dto/create-token-plan.dto';
import { UpdateTokenPlanDto } from './dto/update-token-plan.dto';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from 'src/users/users.schema';

@ApiCookieAuth()
@ApiTags('mods')
@Controller('mods')
export class ModsController {
  constructor(private readonly service: ModsService) {}

  /*
   * public endpoints allowing anyone to know about the mod services provided and pricing of mod tokens
   */
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get list of all mods availaible. Optionally filter by tags',
  })
  async findAllMods(@Query('tags') tags: string[]) {
    return await this.service.findAllMods(tags);
  }

  @Public()
  @Get(':modID')
  @ApiOperation({ summary: 'Get all details of a single mod.' })
  async findMod(@Param('modID') modID: string) {
    return await this.service.findMod(modID);
  }

  /*
   * endpoints allowing admins and superusers to create mods based on availaile mod ids
   */

  @Roles(URoles.superuser, URoles.admin)
  @Post(':modID')
  @ApiOperation({ summary: '[superuser, admin] Create a new mod. ' })
  async createMod(
    @Param('modID') modID: string,
    @Body() createModDto: CreateModDto,
  ) {
    return await this.service.createMod(modID, createModDto);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Patch(':modID')
  @ApiOperation({ summary: '[superuser, admin] Update an existing mod. ' })
  async updateMod(
    @Param('modID') modID: string,
    @Body() updateModDto: UpdateModDto,
  ) {
    return await this.service.updateMod(modID, updateModDto);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Delete(':modID')
  @ApiOperation({ summary: '[superuser, admin] Delete an existing mod.' })
  async removeMod(@Param('id') modID: string) {
    return await this.service.removeMod(modID);
  }

  /*
   * endpoints related to token plans
   */

  @Public()
  @Get('/token-plans')
  @ApiOperation({ summary: 'Get list of all token plans availaible.' })
  async findAllTokenPlans() {
    return await this.service.findAllTokenPlans();
  }

  @Public()
  @Get('/token-plans/:planID')
  @ApiOperation({ summary: 'Get all details of a specific token plan.' })
  async findTokenPlan(@Param('planID') planID: string) {
    return await this.service.findTokenPlan(planID);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Post('/token-plans')
  @ApiOperation({ summary: '[superuser, admin] Create a new token plan.' })
  async createTokenPlan(
    @Param('planID') planID: string,
    createTokenPlanDto: CreateTokenPlanDto,
  ) {
    return await this.service.createTokenPlan(planID, createTokenPlanDto);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Patch('/token-plans/:planID')
  @ApiOperation({
    summary: '[superuser, admin] Update an existing token plan.',
  })
  async updateTokenPlan(
    @Param('planID') planID: string,
    updateTokenPlanDto: UpdateTokenPlanDto,
  ) {
    return await this.service.updateTokenPlan(planID, updateTokenPlanDto);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Delete('/token-plans/:planID')
  @ApiOperation({
    summary: '[superuser, admin] Delete an existing token plan.',
  })
  async deleteTokenPlan(@Param('planID') planID: string) {
    return await this.service.removeTokenPlan(planID);
  }

  /*
   * endpoints concerned with applying and getting results of mods
   */
  @Post('/apply')
  @ApiOperation({
    summary: 'Apply a mod operation on a file.',
  })
  async applyMod(
    @Param('modId') modId: string,
    @Body() applyModDto: ApplyModDto,
  ) {
    return await this.service.applyMod(modId, applyModDto);
  }

  @Get('/status')
  @ApiOperation({
    summary:
      'Check status(progress/result) of a running/finished mod operation',
  })
  async checkModOpStatus(@Param('taskId') taskId: string) {
    return await this.service.checkModOpStatus(taskId);
  }
}
