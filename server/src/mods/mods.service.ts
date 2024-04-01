import { Injectable } from '@nestjs/common';
import { CreateModDto } from './dto/create-mod.dto';
import { UpdateModDto } from './dto/update-mod.dto';
import { CreateTokenPlanDto } from './dto/create-token-plan.dto';
import { UpdateTokenPlanDto } from './dto/update-token-plan.dto';
import { ApplyModDto } from './dto/apply-mod.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Mods, ModTokenPlans, ModsDocument } from './mods.schema';
import { Model } from 'mongoose';

@Injectable()
export class ModsService {
  constructor(
    @InjectModel(Mods.name) private modsModel: Model<ModsDocument>,
    @InjectModel(ModTokenPlans.name)
    private modTokenPlansModel: Model<ModTokenPlans>,
  ) {}

  async findAllMods(tags: string[]) {
    return await this.modsModel.find({ tags: tags }).exec();
  }

  async findMod(modID: string) {
    return await this.modsModel.findOne({ modID: modID });
  }

  async createMod(modID: string, createModDto: CreateModDto) {
    const createdMod = new this.modsModel({ modID: modID, ...createModDto });
    return await createdMod.save();
  }

  async updateMod(modID: string, updateModDto: UpdateModDto) {
    return await this.modsModel.findOneAndUpdate(
      { modID: modID },
      updateModDto,
    );
  }

  async removeMod(modID: string) {
    return await this.modsModel.findOneAndDelete({ modID: modID });
  }

  async findAllTokenPlans() {
    return await this.modTokenPlansModel.find().exec();
  }

  async findTokenPlan(planID: string) {
    return await this.modTokenPlansModel.findOne({ planID: planID });
  }

  async createTokenPlan(
    planID: string,
    createTokenPlanDto: CreateTokenPlanDto,
  ) {
    const createdModTokenPlan = new this.modTokenPlansModel({
      planID: planID,
      ...createTokenPlanDto,
    });
    return await createdModTokenPlan.save();
  }

  async updateTokenPlan(
    planID: string,
    updateTokenPlanDto: UpdateTokenPlanDto,
  ) {
    return await this.modTokenPlansModel.findOneAndUpdate(
      { planID: planID },
      updateTokenPlanDto,
    );
  }

  async removeTokenPlan(planID: string) {
    return await this.modTokenPlansModel.findOneAndDelete({ planID: planID });
  }

  async applyMod(modID: string, applyModDto: ApplyModDto) {
    // load the mod to apply
    // load the dto of mod params
    // check if user has rights to access fileID
    // validate mod params
    // return error if incorrect/insufficient mod params
    // create background task to process this mod
    // return task id so that people can get the status of the mod
    console.log(applyModDto);
    return modID;
  }

  async checkModOpStatus(taskID: string) {
    // validate if the requester is the creator of this task
    // check the status of the task with given task id
    // return processing if still not complete
    // return the file id of result file, and no of tokens consumed when complete
    return taskID;
  }
}
