import { FiatCurrency } from "../models/fiat-currency.model";

const DEFAULT_DECIMALS = 2;
const DEFAULT_LOCALE: string = navigator.language || "en-US";

export const formatCurrency = (
  value: number,
  currency: FiatCurrency = FiatCurrency.ARS,
  decimals = DEFAULT_DECIMALS,
  locale: Intl.LocalesArgument = DEFAULT_LOCALE
) => {
  const minDecimals = Number.isInteger(value) ? 0 : decimals;

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: decimals,
  };

  if (currency !== FiatCurrency.OTHER) {
    options.style = "currency";
    options.currency = currency;
  }

  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatPercentage = (
  value: number,
  decimals: number = DEFAULT_DECIMALS,
  locale: string = DEFAULT_LOCALE
): string => {
  const minDecimals = Number.isInteger(value) ? 0 : decimals;

  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

export const formatNumber = (
  value: number,
  decimals: number = DEFAULT_DECIMALS,
  style: Intl.NumberFormatOptions["style"] = "decimal",
  locale: string = DEFAULT_LOCALE
): string => {
  let minDecimals = Number.isInteger(value) ? 0 : decimals;

  if (value <= 0.01) {
    minDecimals = 4;
  } else if (value <= 0.001) {
    minDecimals = 5;
  }

  return new Intl.NumberFormat(locale, {
    style,
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: Math.max(decimals, minDecimals),
  }).format(value);
};
