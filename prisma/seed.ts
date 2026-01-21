import { PrismaClient } from '../generated/prisma'; // seu path customizado
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL não encontrada no arquivo .env');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

async function seed() {
  // USERS
  await prisma.user.create({
    data: { id: 1, name: 'Fred Marques', email: 'fred.marques@email.com' },
  });
  await prisma.user.create({
    data: {
      id: 2,
      name: 'Carlos Henrique',
      email: 'carlos.henrique@email.com',
    },
  });
  await prisma.user.create({
    data: { id: 3, name: 'Carlos Eduardo', email: 'carlos.eduardo@email.com' },
  });
  await prisma.user.create({
    data: { id: 4, name: 'Geovana Rocha', email: 'geovana.rocha@email.com' },
  });

  // TAGS
  await prisma.tag.create({ data: { id: 1, name: 'Grão Direto' } });
  await prisma.tag.create({ data: { id: 2, name: 'tecnologia' } });
  await prisma.tag.create({ data: { id: 3, name: 'agronegócio' } });
  await prisma.tag.create({ data: { id: 4, name: 'CI/CD' } });
  await prisma.tag.create({ data: { id: 5, name: 'devops' } });
  await prisma.tag.create({ data: { id: 6, name: 'agilidade' } });
  await prisma.tag.create({ data: { id: 7, name: 'NoSQL' } });
  await prisma.tag.create({ data: { id: 8, name: 'banco de dados' } });
  await prisma.tag.create({ data: { id: 9, name: 'escalabilidade' } });
  await prisma.tag.create({ data: { id: 10, name: 'Kubernetes' } });
  await prisma.tag.create({ data: { id: 11, name: 'contêineres' } });
  await prisma.tag.create({ data: { id: 12, name: 'orquestração' } });
  await prisma.tag.create({ data: { id: 13, name: 'serverless' } });
  await prisma.tag.create({ data: { id: 14, name: 'segurança' } });
  await prisma.tag.create({ data: { id: 15, name: 'cloud' } });
  await prisma.tag.create({ data: { id: 16, name: 'DevOps' } });
  await prisma.tag.create({ data: { id: 17, name: 'colaboração' } });
  await prisma.tag.create({ data: { id: 18, name: 'times distribuídos' } });
  await prisma.tag.create({ data: { id: 19, name: 'frontend' } });
  await prisma.tag.create({ data: { id: 20, name: 'frameworks' } });
  await prisma.tag.create({ data: { id: 21, name: 'React' } });
  await prisma.tag.create({ data: { id: 22, name: 'inovação' } });

  // ARTICLES
  await prisma.article.create({
    data: {
      id: 1,
      title: 'A Revolução da Grão Direto no Agronegócio',
      content:
        'A Grão Direto tem transformado o setor agrícola ao introduzir tecnologia de ponta para conectar produtores e compradores de grãos...',
      authorId: 1,
      updatedAt: new Date(),
      tags: { connect: [{ id: 1 }, { id: 2 }, { id: 3 }] },
    },
  });

  await prisma.article.create({
    data: {
      id: 2,
      title: 'Implementando CI/CD em Ambientes Ágeis',
      content:
        'A prática de integração contínua (CI) e entrega contínua (CD) tem se tornado essencial no desenvolvimento de software moderno...',
      authorId: 2,
      updatedAt: new Date(),
      tags: { connect: [{ id: 4 }, { id: 5 }, { id: 6 }] },
    },
  });

  await prisma.article.create({
    data: {
      id: 3,
      title: 'A Importância de Bancos de Dados NoSQL em Sistemas Escaláveis',
      content:
        'Com o crescimento exponencial de dados, bancos de dados NoSQL, como MongoDB, Cassandra e DynamoDB, têm se destacado por sua flexibilidade e escalabilidade...',
      authorId: 3,
      updatedAt: new Date(),
      tags: { connect: [{ id: 7 }, { id: 8 }, { id: 9 }] },
    },
  });

  await prisma.article.create({
    data: {
      id: 4,
      title: 'Como Kubernetes Revolucionou a Orquestração de Contêineres',
      content:
        'Kubernetes se tornou a principal solução para orquestração de contêineres, permitindo a implantação, escalabilidade e gerenciamento de aplicações...',
      authorId: 4,
      updatedAt: new Date(),
      tags: { connect: [{ id: 10 }, { id: 11 }, { id: 12 }] },
    },
  });

  await prisma.article.create({
    data: {
      id: 5,
      title: 'Os Desafios da Segurança em Arquiteturas Serverless',
      content:
        'As arquiteturas serverless oferecem muitas vantagens, como redução de custos e facilidade de escalabilidade. No entanto, também trazem desafios únicos de segurança...',
      authorId: 2,
      updatedAt: new Date(),
      tags: { connect: [{ id: 13 }, { id: 14 }, { id: 15 }] },
    },
  });

  await prisma.article.create({
    data: {
      id: 6,
      title: 'Práticas de DevOps para Times Distribuídos',
      content:
        'A colaboração em times distribuídos pode ser um desafio, mas práticas de DevOps ajudam a alinhar objetivos e acelerar entregas...',
      authorId: 3,
      updatedAt: new Date(),
      tags: { connect: [{ id: 16 }, { id: 17 }, { id: 18 }] },
    },
  });

  await prisma.article.create({
    data: {
      id: 7,
      title: 'A Evolução do Desenvolvimento Frontend com Frameworks Modernos',
      content:
        'Nos últimos anos, o desenvolvimento frontend passou por uma grande evolução graças a frameworks como React, Angular e Vue.js...',
      authorId: 4,
      updatedAt: new Date(),
      tags: { connect: [{ id: 19 }, { id: 20 }, { id: 21 }] },
    },
  });

  await prisma.article.create({
    data: {
      id: 8,
      title: 'O Futuro do Agronegócio com a Grão Direto',
      content:
        'A Grão Direto continua a liderar a transformação digital no agronegócio brasileiro...',
      authorId: 1,
      updatedAt: new Date(),
      tags: { connect: [{ id: 1 }, { id: 22 }, { id: 3 }] },
    },
  });
}

seed()
  .then(() => {
    console.log('Database seeded!');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
