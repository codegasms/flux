import { Injectable } from '@nestjs/common';
import { GetStatusDto } from './dto/get-status.dto';

@Injectable()
export class AppService {
  getStatus(): GetStatusDto {
    return { message: 'Server is up! Enigma!' };
  }
}
