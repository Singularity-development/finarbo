import { Market } from '@common/models/market.model';
import { Portfolio } from '@modules/portfolio/models/portfolio';

export const portfolioHaveCryptos = (portfolio: Portfolio) => {
  return portfolio.assets.some((x) => x.market === Market.CRYPTO);
};
