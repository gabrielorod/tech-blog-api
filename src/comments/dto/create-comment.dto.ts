import { IsString, IsInt, IsOptional, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsInt()
  articleId: number;

  @IsInt()
  @IsOptional()
  parentId?: number;
}
