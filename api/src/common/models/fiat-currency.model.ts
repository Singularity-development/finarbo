export enum FiatCurrency {
  USD = 'USD',
  EUR = 'EUR',
  ARS = 'ARS',
  OTHER = 'OTHER',
}

export const CurrencyName: Record<FiatCurrency, string | undefined> =
  Object.freeze({
    [FiatCurrency.USD]: 'Dolares',
    [FiatCurrency.EUR]: 'Euros',
    [FiatCurrency.ARS]: 'Pesos Argentinos',
    [FiatCurrency.OTHER]: undefined,
  });

export const convertCurrency = (
  value: number,
  from: FiatCurrency,
  to: FiatCurrency,
  rate: number,
): number => {
  if (from === to) return value;

  if (from === FiatCurrency.ARS && to === FiatCurrency.USD) {
    return value / rate;
  }

  if (from === FiatCurrency.USD && to === FiatCurrency.ARS) {
    return value * rate;
  }

  return value;
};
