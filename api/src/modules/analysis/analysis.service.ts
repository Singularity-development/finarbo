import { Injectable } from '@nestjs/common';
import { Result } from './rules/result';
import { RulesService } from './rules/rules.service';
import { PortfolioService } from '@modules/portfolio/portfolio.service';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly rulesService: RulesService,
    private readonly portfolioService: PortfolioService,
  ) {}

  async analyzePortfolio(): Promise<Result[]> {
    const portfolioToAnalyze = await this.portfolioService.getPortfolio();
    return await this.rulesService.analyzePortfolio(portfolioToAnalyze);
  }
}
