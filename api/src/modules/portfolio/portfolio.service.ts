import { Injectable } from '@nestjs/common';
import { PortfolioDto } from './dtos/portfolio.dto';
import portfolioMock from '../../data/portfolio.mock.json';
import { CryptoPortfolioService } from './crypto-portfolio.service';
import { Market } from '@common/models/market.model';
import { DollarApiService } from 'src/providers/dollar-api/dollar-api.service';
import { LocalPortfolioService } from './local-portfolio.service';
import { AssetType } from '@common/models/asset.model';
import { CurrencyPortfolioService } from './currency-portfolio.service';
import { Portfolio } from './models/portfolio';
import { Asset } from './models/asset';
import { InputPortfolioDto } from './dtos/input-portfolio.dto';
import { Mapper } from '@common/util/mapper';
import { FiatCurrency } from '@common/models/fiat-currency.model';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly dollarApiService: DollarApiService,
    private readonly cryptoPortfolioService: CryptoPortfolioService,
    private readonly localPortfolioService: LocalPortfolioService,
    private readonly currencyPortfolioService: CurrencyPortfolioService,
  ) {}

  async getPortfolioDto(
    targetCurrency = FiatCurrency.USD,
  ): Promise<PortfolioDto> {
    const portfolio = await this.getPortfolio(targetCurrency);

    const portfolioDto = Mapper.mapToDto(
      portfolio,
      PortfolioDto,
    ) as PortfolioDto;

    return portfolioDto;
  }

  async getPortfolio(targetCurrency = FiatCurrency.USD): Promise<Portfolio> {
    const input = portfolioMock as InputPortfolioDto; // TODO

    const assets = await this.mapAssets(input);

    const dollarExchange =
      await this.dollarApiService.getAvgStockExchangeRate();

    return new Portfolio(assets, dollarExchange, targetCurrency);
  }

  async mapAssets(portfolio: InputPortfolioDto): Promise<Asset[]> {
    const cryptos = portfolio.portfolio.filter(
      (x) => x.market === Market.CRYPTO,
    );
    const localInvestments = portfolio.portfolio.filter(
      (x) => x.market === Market.ARG,
    );
    // const usaInvestments = portfolio.portfolio.filter(
    //   (x) => x.market === Market.USA,
    // ); // TODO
    const currencies = portfolio.portfolio.filter(
      (x) => x.type === AssetType.CURRENCY,
    );

    const [cryptoAssets, localAssets, currencyAssets] = await Promise.all([
      await this.cryptoPortfolioService.mapCryptoAssets(cryptos),
      await this.localPortfolioService.mapLocalAssets(localInvestments),
      await this.currencyPortfolioService.mapCurrenciesAssets(currencies),
    ]);

    return [...cryptoAssets, ...localAssets, ...currencyAssets];
  }
}
