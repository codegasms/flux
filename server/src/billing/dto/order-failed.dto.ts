import { ApiProperty } from '@nestjs/swagger';

export class RzpOrderFailure {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: Record<string, any>;
  field: string;
}

export class OrderFailedDto {
  @ApiProperty({ default: 502 })
  statusCode: number;
  error: RzpOrderFailure;
}
