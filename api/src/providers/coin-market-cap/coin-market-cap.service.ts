import { Injectable } from '@nestjs/common';
import { CoinMarketCapClient } from './coin-market-cap.client';
import { Mapper } from '@common/util/mapper';
import { CryptoDto } from './dtos/crypto.dto';
import { ResponseDto } from './dtos/response.dto';
import {
  CryptoPageRequestDto,
  CryptoRequestDto,
} from './dtos/crypto-request.dto';
import { toRecord } from '@common/util/array.util';
import { CryptoPriceDto } from './dtos/crypto-price.dto';

@Injectable()
export class CoinMarketService {
  constructor(private readonly coinMarketCapClient: CoinMarketCapClient) {}

  async getAllCryptos(request?: CryptoPageRequestDto): Promise<CryptoDto[]> {
    const cryptos = await this.coinMarketCapClient.getAllCryptos(request);

    this.checkError(cryptos);

    return Mapper.mapToDto(cryptos.data, CryptoDto) as CryptoDto[];
  }

  async getCryptoQuotesBySymbol(
    request?: CryptoRequestDto,
  ): Promise<Record<string, CryptoPriceDto>> {
    const quotes = await this.coinMarketCapClient.getAllCryptoQuotes(request);

    this.checkError(quotes);

    const validQuotes = Object.values(quotes.data)
      .flatMap((x) => x.at(0))
      .filter((x): x is CryptoPriceDto => x !== undefined);

    return Mapper.mapToRecordDto(
      toRecord(validQuotes, (x) => x.symbol),
      CryptoPriceDto,
    );
  }

  private checkError<T>(response: ResponseDto<T>) {
    if (response.status.errorCode) {
      throw new Error(response.status.errorMessage);
    }
  }
}
