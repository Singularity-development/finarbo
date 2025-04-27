import { Controller, Get, Param } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { RuleType } from './rules/rule';

@Controller('v1/analyze/rules')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  analyzePortfolio() {
    return this.analysisService.analyzePortfolio();
  }

  @Get(':rule/assets')
  getPortfolioAssets(@Param('rule') rule: RuleType) {
    return this.analysisService.getAssetInvolvedByRule(rule);
  }
}
