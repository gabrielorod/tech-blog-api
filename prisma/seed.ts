import { PrismaClient, Tag } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

async function main(): Promise<void> {
  const fred = await prisma.user.upsert({
    where: { email: 'fred.marques@email.com' },
    update: {},
    create: {
      name: 'Fred Marques',
      email: 'fred.marques@email.com',
    },
  });

  const carlosH = await prisma.user.upsert({
    where: { email: 'carlos.henrique@email.com' },
    update: {},
    create: {
      name: 'Carlos Henrique',
      email: 'carlos.henrique@email.com',
    },
  });

  const carlosE = await prisma.user.upsert({
    where: { email: 'carlos.eduardo@email.com' },
    update: {},
    create: {
      name: 'Carlos Eduardo',
      email: 'carlos.eduardo@email.com',
    },
  });

  const geovana = await prisma.user.upsert({
    where: { email: 'geovana.rocha@email.com' },
    update: {},
    create: {
      name: 'Geovana Rocha',
      email: 'geovana.rocha@email.com',
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

  const tags: Tag[] = [];

  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags.push(tag);
  }

  const tagByName = new Map(tags.map((tag) => [tag.name, tag.id]));

  await prisma.article.create({
    data: {
      title: 'A Revolução da Grão Direto no Agronegócio',
      content:
        'A Grão Direto tem transformado o setor agrícola ao introduzir tecnologia de ponta...',
      authorId: fred.id,
      updatedAt: new Date(),
      tags: {
        create: [
          { tagId: tagByName.get('Grão Direto')! },
          { tagId: tagByName.get('tecnologia')! },
          { tagId: tagByName.get('agronegócio')! },
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
      updatedAt: new Date(),
      tags: {
        create: [
          { tagId: tagByName.get('CI/CD')! },
          { tagId: tagByName.get('devops')! },
          { tagId: tagByName.get('agilidade')! },
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
      updatedAt: new Date(),
      tags: {
        create: [
          { tagId: tagByName.get('NoSQL')! },
          { tagId: tagByName.get('banco de dados')! },
          { tagId: tagByName.get('escalabilidade')! },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Como Kubernetes Revolucionou a Orquestração de Contêineres',
      content: 'Kubernetes se tornou a principal solução para orquestração...',
      authorId: geovana.id,
      updatedAt: new Date(),
      tags: {
        create: [
          { tagId: tagByName.get('Kubernetes')! },
          { tagId: tagByName.get('contêineres')! },
          { tagId: tagByName.get('orquestração')! },
        ],
      },
    },
  });
}

main()
  .then(() => {
    console.log('Seed executado com sucesso');
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error('Erro ao executar seed:', error.message);
    } else {
      console.error('Erro inesperado ao executar seed:', error);
    }
    process.exit(1);
  })
  .finally(void prisma.$disconnect());
