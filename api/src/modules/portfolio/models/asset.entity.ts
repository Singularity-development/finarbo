import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { AssetType } from '@common/models/asset.model';
import { Market } from '@common/models/market.model';
import { Price } from '@common/models/price.model';
import { FiatCurrency } from '@common/models/fiat-currency.model';

@Entity('assets')
@Unique(['symbol', 'portfolio', 'broker', 'market'])
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  symbol: string;

  @Column({ type: 'enum', enum: AssetType })
  type: AssetType;

  @Column('float')
  amount: number;

  @Column(() => Price, { prefix: 'acp' })
  acp?: Price;

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

  @ManyToOne(() => Portfolio, { onDelete: 'CASCADE' })
  portfolio: Portfolio;

  private constructor(portfolio: Portfolio) {
    this.portfolio = portfolio;
  }

  static createCurrencyAsset(params: {
    currency: string;
    amount: number;
    portfolio: Portfolio;
    operatedDate: Date;
    broker?: string;
  }): Asset {
    const asset = new Asset(params.portfolio);
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
    asset.acp = new Price(1, fiatCurrency);
    asset.total = new Price(params.amount, fiatCurrency);
    return asset;
  }

  static createAsset(params: {
    symbol: string;
    amount: number;
    assetType: AssetType;
    acp: Price;
    portfolio: Portfolio;
    operatedDate: Date;
    market?: Market;
    broker?: string;
  }): Asset {
    const asset = new Asset(params.portfolio);
    asset.symbol = params.symbol;
    asset.type = params.assetType;
    asset.operatedDate = params.operatedDate;
    asset.broker = params.broker;
    asset.market = params.market ?? Market.OTHER;

    asset.amount = params.amount;
    asset.acp = params.acp;
    asset.total = new Price(
      params.amount * params.acp.value,
      params.acp.currency,
    );
    return asset;
  }
}
