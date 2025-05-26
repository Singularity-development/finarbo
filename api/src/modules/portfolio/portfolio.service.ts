import { Injectable } from '@nestjs/common';
import { PortfolioDto, SavePortfolioDto } from './dtos/portfolio.dto';
import portfolioMock from '../../data/portfolio.mock.json';
import { CryptoPortfolioService } from './crypto-portfolio.service';
import { Market } from '@common/models/market.model';
import { DollarApiService } from 'src/providers/dollar-api/dollar-api.service';
import { LocalPortfolioService } from './local-portfolio.service';
import { AssetType } from '@common/models/asset.model';
import { Portfolio as PortfolioModel } from './models/portfolio';
import { Asset } from './models/asset';
import { InputPortfolioDto } from './dtos/input-portfolio.dto';
import { Mapper } from '@common/util/mapper';
import { FiatCurrency } from '@common/models/fiat-currency.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './models/portfolio.entity';
import { UsersService } from 'src/auth/users/users.service';
import { CurrencyPortfolioService } from './currency-portfolio.service';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    private readonly dollarApiService: DollarApiService,
    private readonly cryptoPortfolioService: CryptoPortfolioService,
    private readonly localPortfolioService: LocalPortfolioService,
    private readonly currencyPortfolioService: CurrencyPortfolioService,
    private readonly userService: UsersService,
  ) {}

  async savePortfolio(savePortfolio: SavePortfolioDto) {
    const user = await this.userService.getCurrentUser();

    const portfolio = new Portfolio();
    portfolio.description = savePortfolio.description;
    portfolio.users = [user];
    portfolio.createdBy = user;

    return await this.portfolioRepository.save(portfolio);
  }

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

  async getPortfolio(
    targetCurrency = FiatCurrency.USD,
  ): Promise<PortfolioModel> {
    const input = portfolioMock as InputPortfolioDto; // TODO

    const assets = await this.mapAssets(input);

    const dollarExchange =
      await this.dollarApiService.getAvgStockExchangeRate();

    return new PortfolioModel(assets, dollarExchange, targetCurrency);
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
