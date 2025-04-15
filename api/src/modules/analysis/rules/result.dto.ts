import { Expose } from 'class-transformer';
import { RuleType } from './rule';
import { Severity } from './result';

export class ResultDto {
  @Expose()
  code: RuleType;

  @Expose()
  severity: Severity;

  @Expose()
  score: number;

  @Expose()
  threshold: number;
}
