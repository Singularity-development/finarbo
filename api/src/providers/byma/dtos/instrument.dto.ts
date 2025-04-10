import { FiatCurrency } from '@common/models/fiat-currency.model';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsString, IsInt, IsOptional, IsDate } from 'class-validator';
import { getNominalValueByType, mapToAssetType } from '../instrument.util';

export class InstrumentDto {
  @Expose()
  @IsNumber()
  tradeVolume: number;

  @Expose()
  @IsString()
  symbol: string;

  @Expose()
  @IsNumber()
  imbalance: number;

  @Expose()
  @IsNumber()
  previousSettlementPrice: number;

  @Expose()
  @IsNumber()
  offerPrice: number;

  @Expose()
  @IsNumber()
  openInterest: number;

  @Expose()
  @IsNumber()
  vwap: number;

  @Expose()
  @IsInt()
  numberOfOrders: number;

  @Expose()
  @IsNumber()
  openingPrice: number;

  @Expose()
  @IsInt()
  tickDirection: number;

  @Expose()
  @IsString()
  @IsOptional()
  securityDesc: string;

  @Expose()
  @Transform(({ value }) => {
    const enumValues = Object.values(BymaSecuritySubType);
    if (enumValues.includes(value)) {
      return value as BymaSecuritySubType;
    }
    return BymaSecuritySubType.OTHER;
  })
  securitySubType: BymaSecuritySubType;

  @Expose()
  @Type(() => Date)
  @IsDate()
  maturityDate: Date;

  @Expose()
  @IsNumber()
  previousClosingPrice?: number;

  @Expose()
  @IsString()
  settlementType: string;

  @Expose()
  @IsNumber()
  quantityOffer: number;

  @Expose()
  @IsNumber()
  tradingHighPrice: number;

  @Expose({ name: 'denominationCcy' })
  @Transform(({ value }) => {
    const enumValues = Object.values(FiatCurrency);
    if (enumValues.includes(value)) {
      return value as FiatCurrency;
    }
    return FiatCurrency.OTHER;
  })
  denominationCurrency: FiatCurrency;

  @Expose()
  @IsNumber()
  bidPrice: number;

  @Expose()
  @IsNumber()
  tradingLowPrice: number;

  @Expose()
  @IsString()
  market: string;

  @Expose()
  @IsNumber()
  volumeAmount: number;

  @Expose()
  @IsNumber()
  volume: number;

  @Expose()
  @IsNumber()
  trade: number;

  @Expose()
  @IsInt()
  daysToMaturity: number;

  @Expose()
  @Transform(({ value }) => {
    const enumValues = Object.values(BymaSecurityType);
    if (enumValues.includes(value)) {
      return value as BymaSecurityType;
    }
    return BymaSecurityType.OTHER;
  })
  securityType: BymaSecurityType;

  @Expose()
  @IsNumber()
  closingPrice?: number;

  @Expose()
  @IsNumber()
  settlementPrice?: number;

  @Expose()
  @IsNumber()
  quantityBid: number;

  getLastPrice(): number {
    if (this.settlementPrice && this.settlementPrice !== 0) {
      return this.settlementPrice;
    }

    if (this.closingPrice && this.closingPrice !== 0) {
      return this.closingPrice;
    }

    if (this.previousSettlementPrice && this.previousSettlementPrice !== 0) {
      return this.previousSettlementPrice;
    }

    return 0;
  }

  getNominalPrice(): number {
    return getNominalValueByType(this.getLastPrice(), mapToAssetType(this));
  }
}

export enum BymaSecurityType {
  STOCK = 'CS',
  GENERAL_OBLIGATION_BOND = 'GO',
  OPTION = 'OPT',
  CORPORATE_BOND = 'CORP',
  CEDEAR = 'CD',
  FUTURE = 'FUT',
  CAUCION = 'QA',
  OTHER = 'OTHER',
}

export enum BymaSecuritySubType {
  MERVAL = 'M',
  GENERAL = 'G',
  PLAZO = 'P',
  LETTER = 'L',
  BOND = 'B',
  LETE = 'E',
  BRAZILIAN_REAL = 'BRS',
  US_DOLLAR = 'DO',
  PASE_DOLLAR = 'DOP',
  PASE_MERVAL = 'MVP',
  PASE_REAL = 'BRP',
  OTHER = 'OTHER',
}
