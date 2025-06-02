import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PortfolioSummaryDto, SavePortfolioDto } from './dtos/portfolio.dto';
import { DollarApiService } from 'src/providers/dollar-api/dollar-api.service';
import { Portfolio } from './models/portfolio';
import { Mapper } from '@common/util/mapper';
import { FiatCurrency } from '@common/models/fiat-currency.model';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { PortfolioEntity } from './db/portfolio.entity';
import { UsersService } from 'src/auth/users/users.service';
import { AssetService } from './asset.service';
import { SaveAssetDto, AssetDto, SaveCurrencyAssetDto } from './dtos/asset.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(PortfolioEntity)
    private readonly portfolioRepository: Repository<PortfolioEntity>,
    private readonly dollarApiService: DollarApiService,
    private readonly userService: UsersService,
    private readonly assetService: AssetService,
  ) {}

  async savePortfolio(savePortfolio: SavePortfolioDto) {
    const user = await this.userService.getCurrentUser();

    const portfolio = new PortfolioEntity();
    portfolio.description =
      savePortfolio.description ?? `${user.username}'s portfolio`;
    portfolio.users = [user];
    portfolio.createdBy = user;

    return Mapper.mapToDto(
      await this.portfolioRepository.save(portfolio),
      PortfolioSummaryDto,
    );
  }

  async deletePortfolio(id: string): Promise<void> {
    const portfolio = await this.getPortfolioById(id);

    await this.portfolioRepository.remove(portfolio);
  }

  async changePortfolioDescription(
    id: string,
    description: string,
  ): Promise<PortfolioSummaryDto> {
    const portfolio = await this.getPortfolioById(id);

    portfolio.description = description;

    return Mapper.mapToDto(
      await this.portfolioRepository.save(portfolio),
      PortfolioSummaryDto,
    ) as PortfolioSummaryDto;
  }

  async getUserPortfolios(): Promise<PortfolioSummaryDto[]> {
    const user = await this.userService.getCurrentUser();

    if (!user) {
      return [];
    }

    const portfolios = this.portfolioRepository.find({
      where: { users: { id: user.id } },
      relations: ['createdBy'],
    });

    return Mapper.mapToDto(
      portfolios,
      PortfolioSummaryDto,
    ) as PortfolioSummaryDto[];
  }

  async getPortfolio(
    portfolioId: string,
    targetCurrency = FiatCurrency.USD,
  ): Promise<Portfolio> {
    const portfolio = await this.getPortfolioById(portfolioId, {
      assets: true,
    });

    const [assets, dollarExchange] = await Promise.all([
      this.assetService.mapAssets(portfolio),
      this.dollarApiService.getAvgStockExchangeRate(),
    ]);

    return new Portfolio(assets, dollarExchange, targetCurrency);
  }

  async getPortfolioById(
    id: string,
    relations?: FindOptionsRelations<PortfolioEntity>,
  ): Promise<PortfolioEntity> {
    const user = await this.userService.getCurrentUser();

    if (!user) {
      throw new ForbiddenException();
    }

    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: relations
        ? { ...relations, createdBy: true }
        : { createdBy: true },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    if (portfolio.createdBy.id !== user.id) {
      throw new ForbiddenException('You are not the owner of this portfolio');
    }

    return portfolio;
  }

  async saveAsset(portfolioId: string, asset: SaveAssetDto): Promise<AssetDto> {
    const portfolio = await this.getPortfolioById(portfolioId);
    return await this.assetService.saveAsset(portfolio, asset);
  }

  async saveCurrencyAsset(
    portfolioId: string,
    asset: SaveCurrencyAssetDto,
  ): Promise<AssetDto> {
    const portfolio = await this.getPortfolioById(portfolioId);
    return await this.assetService.saveCurrencyAsset(portfolio, asset);
  }
}
