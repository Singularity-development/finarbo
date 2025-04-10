import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { RulesModule } from './rules/rules.module';
import { PortfolioModule } from '@modules/portfolio/portfolio.module';

@Module({
  imports: [RulesModule, PortfolioModule],
  providers: [AnalysisService],
  controllers: [AnalysisController],
})
export class AnalysisModule {}
