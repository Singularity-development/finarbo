import { Controller, Get, Param } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResultDto } from './rules/result.dto';
import { RuleType } from './rules/rule';
import { AssetDto } from '@modules/portfolio/dtos/asset.dto';

@Controller('v1/analyze/rules')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  @ApiExtraModels(ResultDto)
  @ApiOkResponse({
    description: 'Analysis results indexed by rule code',
    schema: {
      type: 'object',
      additionalProperties: {
        $ref: getSchemaPath(ResultDto),
      },
    },
  })
  analyzePortfolio() {
    return this.analysisService.analyzePortfolio();
  }

  @Get(':rule/assets')
  @ApiOkResponse({ type: AssetDto, isArray: true })
  getPortfolioAssets(@Param('rule') rule: RuleType) {
    return this.analysisService.getAssetInvolvedByRule(rule);
  }
}
