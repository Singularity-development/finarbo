import { BadRequestException, Injectable } from '@nestjs/common';
import { BymaClient } from './byma.client';
import { Mapper } from '@common/util/mapper';
import { InstrumentDto } from './dtos/instrument.dto';

@Injectable()
export class BymaService {
  constructor(private readonly bymaClient: BymaClient) {}

  async getAssetsByType(type: BymaAssetType): Promise<InstrumentDto[]> {
    let assets: InstrumentDto[];
    switch (type) {
      case BymaAssetType.STOCK: {
        const [bestStocks, generalStocks] = await Promise.all([
          this.bymaClient.getBestStocks(),
          this.bymaClient.getGeneralStocks(),
        ]);
        assets = [...bestStocks.data, ...generalStocks.data];
        break;
      }
      case BymaAssetType.BOND:
        assets = (await this.bymaClient.getAllBonds()).data;
        break;
      case BymaAssetType.LETTER:
        assets = (await this.bymaClient.getAllLetters()).data;
        break;
      case BymaAssetType.ON:
        assets = await this.bymaClient.getAllONs();
        break;
      case BymaAssetType.CEDEAR:
        assets = await this.bymaClient.getAllCedears();
        break;
      default:
        throw new BadRequestException(`Invalid asset type: ${String(type)}`);
    }

    if (!assets) {
      return [];
    }

    return Mapper.mapToDto(assets, InstrumentDto) as InstrumentDto[];
  }
}

export enum BymaAssetType {
  STOCK = 'STOCK',
  BOND = 'BOND',
  LETTER = 'LETTER',
  ON = 'ON',
  CEDEAR = 'CEDEAR',
}
