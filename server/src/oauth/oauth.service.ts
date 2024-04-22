import { Injectable } from '@nestjs/common';

@Injectable()
export class OauthService {
  findAll() {
    return `This action returns all oauth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oauth`;
  }

  remove(id: number) {
    return `This action removes a #${id} oauth`;
  }
}
