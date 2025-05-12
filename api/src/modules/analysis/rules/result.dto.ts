import { Expose } from 'class-transformer';
import { RuleType } from './rule';
import { Severity } from './result';
import { ApiProperty } from '@nestjs/swagger';

export class ResultDto {
  @Expose()
  @ApiProperty({ example: 'public-risk' })
  code: RuleType;

  @Expose()
  @ApiProperty({ example: Severity.HIGHT })
  severity: Severity;

  @Expose()
  @ApiProperty()
  score: number;

  @Expose()
  @ApiProperty()
  threshold: number;
}
