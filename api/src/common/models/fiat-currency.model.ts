export enum FiatCurrency {
  USD = 'USD',
  EXT = 'EXT',
  EUR = 'EUR',
  ARS = 'ARS',
  OTHER = 'OTHER',
}

export const CurrencyName: Record<FiatCurrency, string | undefined> =
  Object.freeze({
    [FiatCurrency.USD]: 'Dolares',
    [FiatCurrency.EXT]: 'Dolares exteriores',
    [FiatCurrency.EUR]: 'Euros',
    [FiatCurrency.ARS]: 'Pesos Argentinos',
    [FiatCurrency.OTHER]: undefined,
  });

export const convertCurrency = (
  value: number,
  from?: FiatCurrency,
  to?: FiatCurrency,
  rate?: number,
): number => {
  if (from === to) return value;

  if (!from || !to) {
    return value;
  }

  if (from === FiatCurrency.ARS && to !== FiatCurrency.ARS) {
    return value / (rate ?? 1);
  }

  if (from !== FiatCurrency.ARS && to === FiatCurrency.ARS) {
    return value * (rate ?? 1);
  }

  return value;
};
