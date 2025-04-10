import { Injectable } from '@nestjs/common';
import { Client } from '../util/client';
import { ResponseDto } from './dtos/response.dto';
import { RequestDto } from './dtos/request.dto';
import { InstrumentDto } from './dtos/instrument.dto';

/**
 * Client for interacting with BYMA.
 */
@Injectable()
export class BymaClient extends Client {
  private DEFAULT_REQUEST: RequestDto = {
    excludeZeroPxAndQty: true,
    T1: true,
    T0: false,
    'Content-Type': 'application/json, text/plain',
  };

  constructor() {
    super(
      'https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free',
      'Byma',
    );
  }

  async getAllBonds(
    request: RequestDto = this.DEFAULT_REQUEST,
  ): Promise<ResponseDto<InstrumentDto[]>> {
    return this.post<ResponseDto<InstrumentDto[]>, RequestDto>(
      `/public-bonds`,
      request,
    );
  }

  async getAllLetters(
    request: RequestDto = this.DEFAULT_REQUEST,
  ): Promise<ResponseDto<InstrumentDto[]>> {
    return this.post<ResponseDto<InstrumentDto[]>, RequestDto>(
      `/lebacs`,
      request,
    );
  }

  async getAllONs(
    request: RequestDto = this.DEFAULT_REQUEST,
  ): Promise<InstrumentDto[]> {
    return this.post<InstrumentDto[], RequestDto>(
      `/negociable-obligations`,
      request,
    );
  }

  async getBestStocks(
    request: RequestDto = this.DEFAULT_REQUEST,
  ): Promise<ResponseDto<InstrumentDto[]>> {
    return this.post<ResponseDto<InstrumentDto[]>, RequestDto>(
      `/leading-equity`,
      request,
    );
  }

  async getGeneralStocks(
    request: RequestDto = this.DEFAULT_REQUEST,
  ): Promise<ResponseDto<InstrumentDto[]>> {
    return this.post<ResponseDto<InstrumentDto[]>, RequestDto>(
      `/general-equity`,
      request,
    );
  }

  async getAllCedears(
    request: RequestDto = this.DEFAULT_REQUEST,
  ): Promise<InstrumentDto[]> {
    return this.post<InstrumentDto[], RequestDto>(`/cedears`, request);
  }
}
