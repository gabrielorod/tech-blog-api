import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  IsOptional,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { TagCodes } from '../enum/tag-names.enum';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres' })
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo não pode estar vazio' })
  @MinLength(20, { message: 'O conteúdo deve ser um pouco mais longo' })
  content: string;

  @IsArray()
  @IsEnum(TagCodes, {
    each: true,
    message: 'Tag inválida. Use os códigos em CAPS.',
  })
  @IsOptional()
  tags?: TagCodes[];

  @IsString()
  @IsUrl({}, { message: 'A URL da imagem é inválida' })
  @IsOptional()
  imageUrl?: string;
}
