import { Inject, Injectable } from '@nestjs/common';
import { IRule, RULE_SERVICES } from './rule';
import { Result } from './result';
import { Portfolio } from '@modules/portfolio/models/portfolio';
import { ResultDto } from './result.dto';
import { Mapper } from '@common/util/mapper';

@Injectable()
export class RulesService {
  constructor(@Inject(RULE_SERVICES) private readonly ruleServices: IRule[]) {}

  async analyzePortfolio(portfolio: Portfolio): Promise<ResultDto[]> {
    const alerts: Result[] = (
      await Promise.all(
        this.ruleServices.map(async (rule) => await rule.check(portfolio)),
      )
    ).filter((alert): alert is Result => alert !== undefined);

    return Mapper.mapToDto(alerts, ResultDto) as ResultDto[];
  }
}
