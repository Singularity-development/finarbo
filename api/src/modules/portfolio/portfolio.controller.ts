import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioDto } from './dtos/portfolio.dto';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
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
}
