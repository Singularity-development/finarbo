import { Injectable } from '@nestjs/common';
import { RulesService } from './rules/rules.service';
import { PortfolioService } from '@modules/portfolio/portfolio.service';
import { ResultDto } from './rules/result.dto';
import { toRecord } from '@common/util/array.util';
import { Severity } from './rules/result';
import { RuleType } from './rules/rule';
import { AssetDto } from '@modules/portfolio/dtos/asset.dto';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly rulesService: RulesService,
    private readonly portfolioService: PortfolioService,
  ) {}

  async analyzePortfolio(): Promise<Record<string, ResultDto>> {
    const severityOrder = Object.values(Severity);
    const portfolioToAnalyze = await this.portfolioService.getPortfolio();
    const results =
      await this.rulesService.analyzePortfolio(portfolioToAnalyze);
    return toRecord(
      results.sort(
        (a, b) =>
          severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity),
      ),
      (x) => x.code,
    );
  }

  async getAssetInvolvedByRule(rule: RuleType): Promise<AssetDto[]> {
    const portfolioToAnalyze = await this.portfolioService.getPortfolio();
    return this.rulesService.getAssetInvolvedByRule(portfolioToAnalyze, rule);
  }
}
