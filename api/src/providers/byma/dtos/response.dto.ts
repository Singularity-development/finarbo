import { Expose, Type } from 'class-transformer';

export class ResponseDto<T> {
  @Expose({ name: 'data' })
  data: T;

  @Expose({ name: 'content' })
  @Type(() => ContentDto)
  content: ContentDto;
}

class ContentDto {
  @Expose({ name: 'page_number' })
  pageNumber: number;

  @Expose({ name: 'page_count' })
  pageCount: number;

  @Expose({ name: 'page_size' })
  pageSize: number;

  @Expose({ name: 'total_elements_count' })
  totalElements: number;
}
