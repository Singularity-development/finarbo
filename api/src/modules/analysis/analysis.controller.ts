import { Controller, Get } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('v1/analyze/rules')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  getPortfolio() {
    return this.analysisService.analyzePortfolio();
  }
}
