import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article, Prisma, PrismaClient, Tag } from 'generated/prisma';
import { ArticleResponseDto } from './dto/article-response.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient(): PrismaClient {
    return this.prisma as PrismaClient;
  }

  async findAll(): Promise<ArticleResponseDto[]> {
    const articlesFromDb = await this.prismaClient.article.findMany({
      include: {
        author: { select: { id: true, name: true } },
        tags: true,
      },
    });

    return articlesFromDb.map(
      (item): ArticleResponseDto => ({
        id: item.id,
        title: item.title,
        content: item.content,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        author: {
          id: item.authorId,
          name: item.author.name,
        },
        tags: item.tags,
      }),
    );
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.prismaClient.article.findUnique({
      where: { id },
    });
    if (!article) throw new NotFoundException('Artigo não encontrado');
    return article;
  }

  async create(
    dto: CreateArticleDto,
    authorId: number,
  ): Promise<ArticleResponseDto> {
    console.log('Tentando criar artigo para o autor:', authorId);
    console.log('Dados do DTO:', dto);

    const item = await this.prismaClient.article.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId: authorId,
        tags: {
          connect: dto.tags?.map((tagName) => ({
            name: tagName,
          })),
        },
      },
      include: {
        author: { select: { id: true, name: true } },
        tags: true,
      },
    });

    return {
      id: item.id,
      title: item.title,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      author: {
        id: item.authorId,
        name: item.author.name,
      },
      tags: item.tags,
    };
  }

  async update(
    id: number,
    dto: UpdateArticleDto,
    userId: number,
  ): Promise<ArticleResponseDto> {
    const article = await this.prismaClient.article.findUnique({
      where: { id },
    });

    if (!article) throw new NotFoundException('Artigo não encontrado');

    if (article.authorId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este artigo',
      );
    }

    const updateData: Prisma.ArticleUpdateInput = {
      title: dto.title,
      content: dto.content,
    };

    if (dto.tags && Array.isArray(dto.tags)) {
      const tagsArray: string[] = dto.tags;

      updateData.tags = {
        set: [],
        connect: tagsArray.map((tagName) => ({ name: tagName })),
      };
    }

    const updated = await this.prismaClient.article.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true } },
        tags: true,
      },
    });

    return {
      id: updated.id,
      title: updated.title,
      content: updated.content,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      author: {
        id: updated.author.id,
        name: updated.author.name,
      },
      tags: updated.tags.map((tag: Tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  }

  async remove(id: number, userId: number): Promise<Article> {
    const article = await this.prismaClient.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Artigo não encontrado');
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir este artigo',
      );
    }

    return await this.prismaClient.article.delete({
      where: { id },
    });
  }
}
