import { Expose } from 'class-transformer';

export class PlatformDto {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'symbol' })
  symbol: string;

  @Expose({ name: 'slug' })
  slug: string;

  @Expose({ name: 'token_address' })
  address: string;
}
