import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

export class ResponseDto<T> {
  @Expose({ name: 'data' })
  data: T;

  @Expose({ name: 'status' })
  @Type(() => StatusDto)
  status: StatusDto;
}

class StatusDto {
  @Expose({ name: 'timestamp' })
  @Transform(({ value }) => moment(value).toDate())
  requestDate: Date;

  @Expose({ name: 'error_code' })
  errorCode?: number;

  @Expose({ name: 'error_message' })
  errorMessage?: string;
}
