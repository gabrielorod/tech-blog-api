import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  private get prismaClient() {
    return this.prisma as unknown as PrismaClient;
  }

  async create(dto: CreateCommentDto, userId: number) {
    if (dto.parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) throw new NotFoundException('Comentário pai não encontrado');
    }

    return await this.prisma.comment.create({
      data: {
        content: dto.content,
        articleId: dto.articleId,
        authorId: userId,
        parentId: dto.parentId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });
  }

  async findAllByArticle(articleId: number) {
    const article = await this.prismaClient.article.findUnique({
      where: { id: articleId },
    });

    if (!article) throw new NotFoundException('Artigo não encontrado');

    return await this.prismaClient.comment.findMany({
      where: {
        articleId,
        parentId: null,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        replies: {
          include: {
            author: { select: { id: true, name: true, image: true } },
            parent: {
              include: {
                author: { select: { name: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number, userId: number) {
    const comment = await this.prismaClient.comment.findUnique({
      where: { id },
    });

    if (!comment) throw new NotFoundException('Comentário não encontrado');
    if (comment.authorId !== userId)
      throw new NotFoundException('Sem permissão para deletar');

    return await this.prismaClient.comment.delete({ where: { id } });
  }
}
