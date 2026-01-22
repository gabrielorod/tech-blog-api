import { Tag } from '@prisma/client';

export class ArticleAuthorDto {
  id?: number;
  name?: string;
}

export class ArticleResponseDto {
  id?: number;
  title?: string;
  content?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: ArticleAuthorDto;
  tags?: Tag[];
}
