import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { AssetType } from '@common/models/asset.model';
import { Market } from '@common/models/market.model';
import { Price } from '@common/models/price.model';
import { FiatCurrency } from '@common/models/fiat-currency.model';
import { PortfolioEntity } from './portfolio.entity';
import { getNominalValueByType } from 'src/providers/byma/instrument.util';

@Entity('assets')
@Unique(['symbol', 'portfolio', 'broker', 'market'])
export class AssetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  symbol: string;

  @Column({ type: 'enum', enum: AssetType })
  type: AssetType;

  @Column('float')
  amount: number;

  @Column(() => Price, { prefix: 'acp' })
  acp: Price;

  @Column(() => Price, { prefix: 'total' })
  total: Price;

  @Column({ nullable: true })
  broker?: string;

  @Column({ type: 'enum', enum: Market, nullable: true })
  market?: Market;

  @Column({ type: 'timestamp' })
  operatedDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => PortfolioEntity, {
    onDelete: 'CASCADE',
  })
  portfolio: PortfolioEntity;

  private constructor(portfolio: PortfolioEntity) {
    this.portfolio = portfolio;
  }

  static createCurrencyAsset(params: {
    currency: string;
    amount: number;
    portfolio: PortfolioEntity;
    operatedDate: Date;
    broker?: string;
    acp?: number;
  }): AssetEntity {
    const asset = new AssetEntity(params.portfolio);
    asset.symbol = params.currency;
    asset.type = AssetType.CURRENCY;
    asset.operatedDate = params.operatedDate;
    asset.broker = params.broker;
    asset.amount = params.amount;

    const currencyKey = params.currency as keyof typeof FiatCurrency;
    const fiatCurrency: FiatCurrency =
      currencyKey in FiatCurrency
        ? FiatCurrency[currencyKey]
        : FiatCurrency.OTHER;
    asset.acp = new Price(
      fiatCurrency === FiatCurrency.ARS ? 1 : (params.acp ?? 1),
      fiatCurrency,
    );

    asset.total = new Price(params.amount, fiatCurrency);
    return asset;
  }

  static createAsset(params: {
    symbol: string;
    amount: number;
    assetType: AssetType;
    acp: Price;
    portfolio: PortfolioEntity;
    operatedDate: Date;
    market?: Market;
    broker?: string;
  }): AssetEntity {
    const asset = new AssetEntity(params.portfolio);
    asset.symbol = params.symbol;
    asset.type = params.assetType;
    asset.operatedDate = params.operatedDate;
    asset.broker = params.broker;
    asset.market = params.market ?? Market.OTHER;

    asset.amount = params.amount;
    asset.acp = params.acp;

    const nominalPrice = getNominalValueByType(params.acp.value, asset.type);
    asset.total = new Price(params.amount * nominalPrice, params.acp.currency);
    return asset;
  }
}
