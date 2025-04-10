import { IsBoolean, IsString } from 'class-validator';

export class RequestDto {
  @IsBoolean()
  excludeZeroPxAndQty?: boolean;

  @IsBoolean()
  T1?: boolean;

  @IsBoolean()
  T0?: boolean;

  @IsString()
  'Content-Type'?: string;
}
