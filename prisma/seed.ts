import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { PrismaClient, Tag } from '@prisma/client';

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
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('mudar123', salt);

  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const fred = await prisma.user.create({
    data: {
      name: 'Fred Marques',
      email: 'fred.marques@email.com',
      password: defaultPassword,
    },
  });
  const carlosH = await prisma.user.create({
    data: {
      name: 'Carlos Henrique',
      email: 'carlos.henrique@email.com',
      password: defaultPassword,
    },
  });
  const carlosE = await prisma.user.create({
    data: {
      name: 'Carlos Eduardo',
      email: 'carlos.eduardo@email.com',
      password: defaultPassword,
    },
  });
  const geovana = await prisma.user.create({
    data: {
      name: 'Geovana Rocha',
      email: 'geovana.rocha@email.com',
      password: defaultPassword,
    },
  });

  const tagNames = [
    'Grão Direto',
    'tecnologia',
    'agronegócio',
    'CI/CD',
    'devops',
    'agilidade',
    'NoSQL',
    'banco de dados',
    'escalabilidade',
    'Kubernetes',
    'contêineres',
    'orquestração',
    'serverless',
    'segurança',
    'cloud',
    'DevOps',
    'colaboração',
    'times distribuídos',
    'frontend',
    'frameworks',
    'React',
    'inovação',
  ];

  const tags: Record<string, Tag> = {};
  for (const name of tagNames) {
    tags[name] = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  await prisma.article.create({
    data: {
      title: 'A Revolução da Grão Direto no Agronegócio',
      content:
        'A Grão Direto tem transformado o setor agrícola ao introduzir tecnologia de ponta...',
      authorId: fred.id,
      tags: {
        connect: [
          { id: tags['Grão Direto'].id },
          { id: tags['tecnologia'].id },
          { id: tags['agronegócio'].id },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Implementando CI/CD em Ambientes Ágeis',
      content:
        'A prática de integração contínua (CI) e entrega contínua (CD)...',
      authorId: carlosH.id,
      tags: {
        connect: [
          { id: tags['CI/CD'].id },
          { id: tags['devops'].id },
          { id: tags['agilidade'].id },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'A Importância de Bancos de Dados NoSQL em Sistemas Escaláveis',
      content:
        'Com o crescimento exponencial de dados, bancos de dados NoSQL...',
      authorId: carlosE.id,
      tags: {
        connect: [
          { id: tags['NoSQL'].id },
          { id: tags['banco de dados'].id },
          { id: tags['escalabilidade'].id },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Como Kubernetes Revolucionou a Orquestração de Contêineres',
      content: 'Kubernetes se tornou a principal solução para orquestração...',
      authorId: geovana.id,
      tags: {
        connect: [
          { id: tags['Kubernetes'].id },
          { id: tags['contêineres'].id },
          { id: tags['orquestração'].id },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Os Desafios da Segurança em Arquiteturas Serverless',
      content: 'As arquiteturas serverless oferecem muitas vantagens...',
      authorId: carlosH.id,
      tags: {
        connect: [
          { id: tags['serverless'].id },
          { id: tags['segurança'].id },
          { id: tags['cloud'].id },
        ],
      },
    },
  });

  console.log('Seed finalizado com sucesso!');
}

seed()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
