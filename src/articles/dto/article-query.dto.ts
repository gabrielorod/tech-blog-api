import { IsOptional, IsEnum, IsString, IsNumberString } from 'class-validator';
import { TagCodes } from '../enum/tag-names.enum';

export class ArticleQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TagCodes, {
    message: (args) => {
      const allowedValues = Object.values(TagCodes).filter(
        (v) => typeof v === 'string',
      );

      return `A tag '${args.value}' é inválida. Use os códigos em CAPS LOCK. Valores aceitos: ${allowedValues.join(', ')}`;
    },
  })
  tag?: TagCodes;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  pageSize?: string;
}
