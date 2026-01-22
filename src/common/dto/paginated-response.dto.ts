export class PaginationMetaDto {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class PaginatedResponseDto<T> {
  data: T[];
  pagination: PaginationMetaDto;
}
