import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { PageRequestDto } from './page-request.dto';

export class CryptoRequestDto {
  /**
   * One or more comma-separated CoinMarketCap cryptocurrency IDs.
   * @example "1,2"
   */
  @IsString()
  @IsOptional()
  @ValidateIf((obj: CryptoRequestDto) => !obj.slug && !obj.symbol)
  id?: string;

  /**
   * One or more comma-separated cryptocurrency slugs.
   * @example "bitcoin,ethereum"
   */
  @IsString()
  @IsOptional()
  @ValidateIf((obj: CryptoRequestDto) => !obj.id && !obj.symbol)
  slug?: string;

  /**
   * One or more comma-separated cryptocurrency symbols.
   * @example "BTC,ETH"
   */
  @IsString()
  @IsOptional()
  @ValidateIf((obj: CryptoRequestDto) => !obj.id && !obj.slug)
  symbol?: string;
}

export class CryptoPageRequestDto extends PageRequestDto {
  /**
   * One or more comma-separated cryptocurrency symbols.
   * @example "BTC,ETH"
   */
  @IsString()
  @IsOptional()
  symbol?: string;
}
