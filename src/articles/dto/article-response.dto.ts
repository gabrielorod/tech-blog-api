import { Tag } from 'generated/prisma';

export class ArticleAuthorDto {
  id?: number;
  name?: string;
}

export class ArticleResponseDto {
  id?: number;
  title?: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: ArticleAuthorDto;
  tags?: Tag[];
}
