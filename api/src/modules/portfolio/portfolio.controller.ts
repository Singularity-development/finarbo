import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseEnumPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioDto, SavePortfolioDto } from './dtos/portfolio.dto';
import { ApiBody, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { PortfolioCurrency, toFiatCurrency } from './models/portfolio';

@Controller('v1/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiOkResponse({ type: PortfolioDto })
  @ApiQuery({
    name: 'portfolioCurrency',
    enum: PortfolioCurrency,
    required: false,
    description: 'Optional type of currency exchange to use',
  })
  getPortfolio(
    @Query(
      'portfolioCurrency',
      new ParseEnumPipe(PortfolioCurrency, { optional: true }),
    )
    portfolioCurrency?: PortfolioCurrency,
  ): Promise<PortfolioDto> {
    return this.portfolioService.getPortfolioDto(
      toFiatCurrency(portfolioCurrency ?? PortfolioCurrency.USD),
    );
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SavePortfolioDto })
  @ApiOkResponse({ type: PortfolioDto })
  savePortfolio(@Body() portfolio: SavePortfolioDto) {
    return this.portfolioService.savePortfolio(portfolio);
  }
}
