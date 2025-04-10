import { Injectable } from '@nestjs/common';
import { Client } from '../util/client';
import {
  CryptoRequestDto,
  CryptoPageRequestDto,
} from './dtos/crypto-request.dto';
import { ResponseDto } from './dtos/response.dto';
import { CryptoDto } from './dtos/crypto.dto';
import { CryptoPriceDto } from './dtos/crypto-price.dto';

/**
 * Client for interacting with the [CoinMarketCap Api](https://coinmarketcap.com/api/documentation/v1).
 */
@Injectable()
export class CoinMarketCapClient extends Client {
  constructor() {
    const apiKey = process.env.COIN_MARKET_API_KEY;

    if (!apiKey) {
      throw new Error('Missing Coin market cap api key');
    }

    super('https://pro-api.coinmarketcap.com', 'CoinMarketCap', {
      headers: { 'X-CMC_PRO_API_KEY': apiKey },
    });
  }

  /**
   * @see https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMap
   */
  async getAllCryptos(request?: CryptoPageRequestDto) {
    return this.get<ResponseDto<CryptoDto[]>, CryptoPageRequestDto>(
      `/v1/cryptocurrency/map`,
      {
        params: {
          ...request,
          start: request?.start ?? 1,
          limit: request?.limit ?? 100,
          sort: request?.sort ?? 'cmc_rank',
        },
      },
    );
  }

  /**
   * @see https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyInfo
   */
  async getAllCryptosMetadata(request?: CryptoRequestDto) {
    return this.get(`/v2/cryptocurrency/info`, {
      params: request,
    });
  }

  /**
   * @access Only for plan [Hobbyist](https://pro.coinmarketcap.com/api/pricing)
   * @see https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyListingsLatest
   */
  async getAllCryptoLastPrices(request?: CryptoRequestDto) {
    return this.get(`/v1/cryptocurrency/listings/latest`, {
      params: request,
    });
  }

  /**
   * @see https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyQuotesLatest
   */
  async getAllCryptoQuotes(request?: CryptoRequestDto) {
    return this.get<
      ResponseDto<Record<string, CryptoPriceDto[]>>,
      CryptoRequestDto
    >(`/v2/cryptocurrency/quotes/latest`, {
      params: request,
    });
  }
}
