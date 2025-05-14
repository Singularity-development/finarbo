import { AssetType } from "@/common/models/asset.model";
import { Market } from "@/common/models/market.model";
import { Price } from "@/common/models/price.model";

export type Portfolio = {
  assets: Asset[];
  total: Price;
  result: Price;
  percentageResult: number;
  date: Date;
  exchange: number;
  markets: {
    cryptos?: Price;
    stocks?: Price;
  };
};

export type Asset = {
  symbol: string;
  type: AssetType;
  name?: string;
  slug?: string;
  market?: Market;
  amount: number;
  acp?: Price;
  lastPrice?: Price;
  total: Price;
  result?: Price;
  percentageResult?: number;
  updateDate?: Date;
  brokers: Broker[];
  holding: number;
};

export type Broker = {
  name: string;
  amount: number;
  result?: Price;
};

export enum PortfolioCurrency {
  USD = "USD",
  ARS = "ARS",
}
