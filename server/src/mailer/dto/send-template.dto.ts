import { PartialType } from '@nestjs/swagger';
import { SendMailDto } from './send-mail.dto';

export class SendTemplateDto extends PartialType(SendMailDto) {
  username: string;
  templateType?: string;
}
