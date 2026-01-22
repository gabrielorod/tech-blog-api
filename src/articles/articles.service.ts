import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article, Prisma, PrismaClient, Tag } from '@prisma/client';
import { ArticleResponseDto } from './dto/article-response.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { TagLabels } from './enum/tag-names.enum';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient(): PrismaClient {
    return this.prisma as PrismaClient;
  }

  async findAll(
    search?: string,
    tag?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResponseDto<ArticleResponseDto>> {
    const limit = Math.min(pageSize, 50);
    const skip = (page - 1) * limit;

    const tagLabel = tag ? TagLabels[tag] : undefined;

    const where: Prisma.ArticleWhereInput = {
      AND: [
        search ? { title: { contains: search, mode: 'insensitive' } } : {},
        tagLabel ? { tags: { some: { name: tagLabel } } } : {},
      ],
    };

    const [articles, total] = await Promise.all([
      this.prismaClient.article.findMany({
        where,
        skip,
        take: limit,
        include: { author: true, tags: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaClient.article.count({ where }),
    ]);

    const mappedArticles = articles.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      author: { id: item.authorId, name: item.author.name },
      tags: item.tags,
    }));

    return {
      data: mappedArticles,
      pagination: {
        totalItems: total,
        itemCount: mappedArticles.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number): Promise<ArticleResponseDto> {
    const item = await this.prismaClient.article.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
        tags: true,
      },
    });

    if (!item) throw new NotFoundException('Artigo não encontrado');

    return {
      id: item.id,
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      author: {
        id: item.authorId,
        name: item.author.name,
      },
      tags: item.tags,
    };
  }

  async create(
    dto: CreateArticleDto,
    authorId: number,
  ): Promise<ArticleResponseDto> {
    const item = await this.prismaClient.article.create({
      data: {
        title: dto.title,
        content: dto.content,
        imageUrl: dto.imageUrl,
        authorId: authorId,
        tags: {
          connect: dto.tags?.map((code) => ({ name: TagLabels[code] })),
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
      imageUrl: item.imageUrl,
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
      imageUrl: dto.imageUrl,
    };

    if (dto.tags && Array.isArray(dto.tags)) {
      updateData.tags = {
        set: [],
        connect: dto.tags?.map((code) => ({
          name: TagLabels[code],
        })),
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
      imageUrl: updated.imageUrl,
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

    if (!article) throw new NotFoundException('Artigo não encontrado');

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
