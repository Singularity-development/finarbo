import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import {
  PortfolioDto,
  PortfolioSummaryDto,
  RenamePortfolioDto,
  SavePortfolioDto,
} from './dtos/portfolio.dto';
import { ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AssetDto, SaveAssetDto, SaveCurrencyAssetDto } from './dtos/asset.dto';
import { AssetService } from './asset.service';
import { FiatCurrency } from '@common/models/fiat-currency.model';
import { Mapper } from '@common/util/mapper';

@Controller('v1/portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly assetService: AssetService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SavePortfolioDto })
  @ApiOkResponse({ type: PortfolioSummaryDto })
  savePortfolio(@Body() portfolio: SavePortfolioDto) {
    return this.portfolioService.savePortfolio(portfolio);
  }

  @Get('summary/list')
  @ApiOkResponse({ type: PortfolioSummaryDto, isArray: true })
  getUserPortfolios(): Promise<PortfolioSummaryDto[]> {
    return this.portfolioService.getUserPortfolios();
  }

  @Get(':portfolioId')
  @ApiParam({ name: 'portfolioId', type: String, description: 'Portfolio ID' })
  @ApiQuery({
    name: 'targetCurrency',
    type: String,
    required: false,
    description: 'Target currency for portfolio value',
    example: FiatCurrency.USD,
  })
  @ApiOkResponse({ type: PortfolioDto })
  getPortfolio(
    @Param('portfolioId') portfolioId: string,
    @Query('targetCurrency')
    targetCurrency: FiatCurrency.USD = FiatCurrency.USD,
  ) {
    const portfolio = this.portfolioService.getPortfolio(
      portfolioId,
      targetCurrency,
    );
    return Mapper.mapToDto(portfolio, PortfolioDto) as PortfolioDto;
  }

  @Delete(':portfolioId')
  @ApiParam({ name: 'portfolioId', type: String, description: 'Portfolio ID' })
  deletePortfolio(@Param('portfolioId') portfolioId: string) {
    return this.portfolioService.deletePortfolio(portfolioId);
  }

  @Put(':portfolioId/description')
  @ApiBody({ type: RenamePortfolioDto })
  @ApiParam({ name: 'portfolioId', type: String, description: 'Portfolio ID' })
  @ApiOkResponse({ type: PortfolioSummaryDto })
  changePortfolioDescription(
    @Param('portfolioId') portfolioId: string,
    @Body() body: RenamePortfolioDto,
  ) {
    return this.portfolioService.changePortfolioDescription(
      portfolioId,
      body.description,
    );
  }

  @Post(':portfolioId/asset')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SaveAssetDto })
  @ApiOkResponse({ type: AssetDto })
  saveAsset(
    @Param('portfolioId') portfolioId: string,
    @Body() asset: SaveAssetDto,
  ) {
    return this.portfolioService.saveAsset(portfolioId, asset);
  }

  @Post(':portfolioId/asset/currency')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SaveCurrencyAssetDto })
  @ApiOkResponse({ type: AssetDto })
  saveCurrencyAsset(
    @Param('portfolioId') portfolioId: string,
    @Body() asset: SaveCurrencyAssetDto,
  ) {
    return this.portfolioService.saveCurrencyAsset(portfolioId, asset);
  }

  @Delete(':portfolioId/asset/:assetId')
  @ApiParam({ name: 'portfolioId', type: String, description: 'Portfolio ID' })
  @ApiParam({
    name: 'assetId',
    type: String,
    description: 'Asset ID to delete',
  })
  deleteAsset(
    @Param('portfolioId') portfolioId: string,
    @Param('assetId') assetId: string,
  ) {
    return this.assetService.deleteAsset(portfolioId, assetId);
  }

  @Put(':portfolioId/asset/:assetId')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SaveAssetDto })
  @ApiParam({ name: 'portfolioId', type: String, description: 'Portfolio ID' })
  @ApiParam({
    name: 'assetId',
    type: String,
    description: 'Asset ID to update',
  })
  @ApiOkResponse({ type: AssetDto })
  updateAsset(
    @Param('portfolioId') portfolioId: string,
    @Param('assetId') assetId: string,
    @Body() asset: SaveAssetDto,
  ) {
    return this.assetService.updateAsset(portfolioId, assetId, asset);
  }

  @Put(':portfolioId/asset/:assetId/currency')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SaveCurrencyAssetDto })
  @ApiParam({ name: 'portfolioId', type: String, description: 'Portfolio ID' })
  @ApiParam({
    name: 'assetId',
    type: String,
    description: 'Asset ID to update',
  })
  @ApiOkResponse({ type: AssetDto })
  updateCurrencyAsset(
    @Param('portfolioId') portfolioId: string,
    @Param('assetId') assetId: string,
    @Body() asset: SaveCurrencyAssetDto,
  ) {
    return this.assetService.updateCurrencyAsset(portfolioId, assetId, asset);
  }
}
