import { AssetType } from '@common/models/asset.model';
import { Market } from '@common/models/market.model';

export class InputPortfolioDto {
  portfolio: InputAssetDto[];
}

export class InputAssetDto {
  symbol: string;

  /**
   * Average cost price
   */
  acp: number;

  amount: number;

  broker?: string;

  type?: AssetType = AssetType.OTHER;

  market?: Market = Market.OTHER;
}
