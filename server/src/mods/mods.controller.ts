import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  Req,
} from '@nestjs/common';
import { ModsService } from './mods.service';
import { CreateModDto } from './dto/create-mod.dto';
import { UpdateModDto } from './dto/update-mod.dto';
import { ApplyModDto } from './dto/apply-mod.dto';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { CreateTokenPlanDto } from './dto/create-token-plan.dto';
import { UpdateTokenPlanDto } from './dto/update-token-plan.dto';
import { Roles } from 'src/auth/roles.decorator';
import { URoles } from 'src/users/users.schema';
import { AuthorizedRequest } from 'src/auth/entities/authorized-request.entity';
import { TokenPlanOutDto } from './dto/token-plan-out.dto';

@ApiCookieAuth()
@ApiBearerAuth()
@ApiTags('mods')
@Controller('mods')
export class ModsController {
  constructor(private readonly service: ModsService) {}

  /*
   * endpoints concerned with applying and getting results of mods
   */
  @Post('/apply/:modId')
  @ApiOperation({
    summary: 'Apply a mod operation on a file.',
  })
  async applyMod(
    @Req() req: AuthorizedRequest,
    @Param('modId') modId: string,
    @Body() applyModDto: ApplyModDto,
  ) {
    const userId = String(req.perms._id);
    return await this.service.applyMod(userId, modId, applyModDto);
  }

  @Get('/status/:taskId')
  @ApiOperation({
    summary:
      'Check status(progress/result) of a running/finished mod operation',
  })
  async checkModOpStatus(@Param('taskId') taskId: string) {
    return await this.service.checkModOpStatus(taskId);
  }

  /*
   * endpoints related to token plans
   */

  @Public()
  @Get('/token-plans')
  @ApiOperation({ summary: 'Get list of all token plans availaible.' })
  async findAllTokenPlans(): Promise<TokenPlanOutDto[]> {
    return await this.service.findAllTokenPlans();
  }

  @Roles(URoles.superuser, URoles.admin)
  @Post('/token-plans/:planID')
  @ApiOperation({ summary: '[superuser, admin] Create a new token plan.' })
  async createTokenPlan(
    @Param('planID') planID: string,
    @Body() createTokenPlanDto: CreateTokenPlanDto,
  ): Promise<TokenPlanOutDto> {
    console.log(createTokenPlanDto);
    return await this.service.createTokenPlan(planID, createTokenPlanDto);
  }

  @Public()
  @Get('/token-plans/:planID')
  @ApiOperation({ summary: 'Get all details of a specific token plan.' })
  async findTokenPlan(
    @Param('planID') planID: string,
  ): Promise<TokenPlanOutDto> {
    return await this.service.findTokenPlan(planID);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Patch('/token-plans/:planID')
  @ApiOperation({
    summary: '[superuser, admin] Update an existing token plan.',
  })
  async updateTokenPlan(
    @Param('planID') planID: string,
    @Body() updateTokenPlanDto: UpdateTokenPlanDto,
  ): Promise<TokenPlanOutDto> {
    return await this.service.updateTokenPlan(planID, updateTokenPlanDto);
  }

  @Roles(URoles.superuser, URoles.admin)
  @Delete('/token-plans/:planID')
  @ApiOperation({
    summary: '[superuser, admin] Delete an existing token plan.',
  })
  async deleteTokenPlan(
    @Param('planID') planID: string,
  ): Promise<TokenPlanOutDto> {
    return await this.service.removeTokenPlan(planID);
  }

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
}
