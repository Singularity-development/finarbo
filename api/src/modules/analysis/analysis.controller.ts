import { Controller, Get } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResultDto } from './rules/result.dto';

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
  getPortfolio() {
    return this.analysisService.analyzePortfolio();
  }
}
