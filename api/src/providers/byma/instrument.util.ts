import { AssetType } from '@common/models/asset.model';
import {
  BymaSecuritySubType,
  BymaSecurityType,
  InstrumentDto,
} from './dtos/instrument.dto';

export const getNominalValueByType = (
  value: number,
  type: AssetType,
): number => {
  if (
    type === AssetType.LETTER ||
    type === AssetType.ON ||
    type === AssetType.BOND
  ) {
    return value / 100;
  }

  return value;
};

export const mapToAssetType = (instrument: InstrumentDto): AssetType => {
  const { securityType, securitySubType } = instrument;

  if (securityType === BymaSecurityType.CORPORATE_BOND) {
    return AssetType.ON;
  }

  if (securityType === BymaSecurityType.STOCK) {
    return AssetType.STOCK;
  }

  if (securityType === BymaSecurityType.CEDEAR) {
    return AssetType.CEDEAR;
  }

  if (
    securitySubType === BymaSecuritySubType.LETTER ||
    securitySubType === BymaSecuritySubType.LETE
  ) {
    return AssetType.LETTER;
  }

  if (securitySubType === BymaSecuritySubType.BOND) {
    return AssetType.BOND;
  }

  if (securitySubType === BymaSecuritySubType.US_DOLLAR) {
    return AssetType.CURRENCY;
  }

  return AssetType.OTHER;
};
