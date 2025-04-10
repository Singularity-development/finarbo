import { FiatCurrency } from "./fiat-currency.model";

export type Price = {
  value: number;
  currency: FiatCurrency;
};
