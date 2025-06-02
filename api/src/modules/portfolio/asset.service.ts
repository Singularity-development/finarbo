import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssetEntity } from './db/asset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './models/asset';
import { Market } from '@common/models/market.model';
import { AssetType } from '@common/models/asset.model';
import { UsersService } from 'src/auth/users/users.service';
import { CryptoPortfolioService } from './crypto-portfolio.service';
import { CurrencyPortfolioService } from './currency-portfolio.service';
import { LocalPortfolioService } from './local-portfolio.service';
import { AssetDto, SaveAssetDto, SaveCurrencyAssetDto } from './dtos/asset.dto';
import { Mapper } from '@common/util/mapper';
import { PortfolioEntity } from './db/portfolio.entity';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly assetRepository: Repository<AssetEntity>,
    private readonly cryptoPortfolioService: CryptoPortfolioService,
    private readonly localPortfolioService: LocalPortfolioService,
    private readonly currencyPortfolioService: CurrencyPortfolioService,
    private readonly userService: UsersService,
  ) {}

  async saveCurrencyAsset(
    portfolio: PortfolioEntity,
    asset: SaveCurrencyAssetDto,
  ): Promise<AssetDto> {
    const assetToSave = AssetEntity.createCurrencyAsset({
      portfolio,
      currency: asset.symbol,
      ...asset,
    });

    return this.persistAsset(portfolio, assetToSave);
  }

  async saveAsset(
    portfolio: PortfolioEntity,
    asset: SaveAssetDto,
  ): Promise<AssetDto> {
    const assetToSave = AssetEntity.createAsset({
      portfolio,
      ...asset,
    });

    return this.persistAsset(portfolio, assetToSave);
  }

  async persistAsset(portfolio: PortfolioEntity, assetToSave: AssetEntity) {
    const storedAsset = await this.assetRepository.findOne({
      where: {
        symbol: assetToSave.symbol,
        portfolio: { id: portfolio.id },
        market: assetToSave.market,
        broker: assetToSave.broker,
      },
    });

    if (storedAsset) {
      storedAsset.amount += assetToSave.amount;

      // Recalculate the average cost price (ACP)
      const totalAmount = storedAsset.amount + assetToSave.amount;
      storedAsset.acp.value =
        (storedAsset.amount * storedAsset.acp.value +
          assetToSave.amount * assetToSave.acp.value) /
        totalAmount;

      return Mapper.mapToDto(
        await this.assetRepository.save(storedAsset),
        AssetDto,
      ) as AssetDto;
    } else {
      return Mapper.mapToDto(
        await this.assetRepository.save(assetToSave),
        AssetDto,
      ) as AssetDto;
    }
  }

  async deleteAsset(portfolioId: string, assetId: string) {
    const asset = await this.getAssetById(assetId);

    if (asset.portfolio.id !== portfolioId) {
      throw new ForbiddenException('Asset does not belong to this portfolio');
    }

    await this.assetRepository.remove(asset);
  }

  async updateCurrencyAsset(
    portfolioId: string,
    assetId: string,
    asset: SaveCurrencyAssetDto,
  ) {
    return this.update(portfolioId, assetId, asset, (params) =>
      AssetEntity.createCurrencyAsset(params),
    );
  }

  async updateAsset(portfolioId: string, assetId: string, asset: SaveAssetDto) {
    return this.update(portfolioId, assetId, asset, (params) =>
      AssetEntity.createAsset(params),
    );
  }

  private async update<T>(
    portfolioId: string,
    assetId: string,
    asset: T,
    creator: (params: any) => Partial<AssetEntity>,
  ): Promise<AssetDto> {
    const storedAsset = await this.getAssetById(assetId);

    if (storedAsset.portfolio.id !== portfolioId) {
      throw new ForbiddenException('Asset does not belong to this portfolio');
    }

    const assetToUpdate = creator({
      portfolio: storedAsset.portfolio,
      ...asset,
    });

    const saved = await this.assetRepository.save({
      ...storedAsset,
      ...assetToUpdate,
      id: storedAsset.id,
    });

    return Mapper.mapToDto(saved, AssetDto) as AssetDto;
  }

  async getAssetById(id: string): Promise<AssetEntity> {
    const user = await this.userService.getCurrentUser();

    if (!user) {
      throw new ForbiddenException();
    }

    const asset = await this.assetRepository.findOne({
      where: { id },
      relations: ['portfolio'],
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }

  // TODO
  async mapAssets(portfolio: PortfolioEntity): Promise<Asset[]> {
    const { assets } = portfolio;

    const cryptos = assets.filter((x) => x.market === Market.CRYPTO);
    const localInvestments = assets.filter((x) => x.market === Market.ARG);
    // const usaInvestments = portfolio.portfolio.filter(
    //   (x) => x.market === Market.USA,
    // ); // TODO
    const currencies = assets.filter((x) => x.type === AssetType.CURRENCY);

    const [cryptoAssets, localAssets, currencyAssets] = await Promise.all([
      await this.cryptoPortfolioService.mapCryptoAssets(cryptos),
      await this.localPortfolioService.mapLocalAssets(localInvestments),
      await this.currencyPortfolioService.mapCurrenciesAssets(currencies),
    ]);

    return [...cryptoAssets, ...localAssets, ...currencyAssets];
  }
}
