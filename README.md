# Tech Blog API

Uma API REST moderna para um blog de tecnologia, construída com NestJS, Prisma e PostgreSQL.

## 📋 Requisitos

- **Node.js** v18+ (npm incluído)
- **Docker** e **Docker Compose**
- **Git**

## 🚀 Quick Start

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd tech-blog-api
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/tech-blog-db?schema=public"
```

### 4. Iniciar o PostgreSQL com Docker

```bash
docker-compose up -d
```

Isso vai iniciar:
- **PostgreSQL** na porta `5432`
- **PgAdmin** na porta `5050`

### 5. Executar as migrações do Prisma

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 6. Rodar a aplicação

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run start:prod
```

A API estará disponível em `http://localhost:3000`

## 📊 Visualizar o Banco de Dados

### Opção 1: PgAdmin (Recomendado)

Acesse: **http://localhost:5050**

**Login:**
- Email: `admin@example.com`
- Password: `admin`

**Cadastrar servidor:**
1. Clique em "Servers" → "Register" → "Server"
2. Preencha com:
   - Hostname: `postgres`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`

### Opção 2: Prisma Studio

```bash
docker run -p 5555:5555 --network tech-blog-api_default -v ${PWD}:/work -w /work node:24-alpine sh -c "npm ci && DATABASE_URL=postgresql://postgres:postgres@tech-blog-db:5432/tech-blog-db npx prisma studio --port 5555"
```

Acesse: **http://localhost:5555**

### Opção 3: Terminal (CLI)

```bash
docker exec tech-blog-db psql -U postgres -d tech-blog-db -c '\dt'
```

## 🗂️ Estrutura do Projeto

```
tech-blog-api/
├── src/
│   ├── app.controller.ts      # Controlador principal
│   ├── app.service.ts         # Serviço principal
│   ├── app.module.ts          # Módulo principal
│   └── main.ts                # Entrada da aplicação
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Histórico de migrações
├── prisma.config.ts           # Configuração do Prisma
├── docker-compose.yml         # Configuração do Docker
├── .env                       # Variáveis de ambiente
└── package.json               # Dependências do projeto
```

## 📦 Dependências Principais

- **NestJS** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **TypeScript** - Linguagem tipada

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📝 Scripts Disponíveis

```bash
npm run start         # Rodar em produção
npm run start:dev     # Rodar em desenvolvimento com watch
npm run start:debug   # Rodar com debug
npm run build         # Build da aplicação
npm run lint          # Verificar linting
npm run format        # Formatar código
```

## 🔄 Prisma Migrations

Para criar uma nova migração após alterar o schema:

```bash
docker run --network tech-blog-api_default -v ${PWD}:/work -w /work node:24-alpine sh -c "npm ci && DATABASE_URL=postgresql://postgres:postgres@tech-blog-db:5432/tech-blog-db npx prisma migrate dev --name <nome-da-migracao>"
```

Exemplo:
```bash
docker run --network tech-blog-api_default -v ${PWD}:/work -w /work node:24-alpine sh -c "npm ci && DATABASE_URL=postgresql://postgres:postgres@tech-blog-db:5432/tech-blog-db npx prisma migrate dev --name add_user_role"
```

## 🗄️ Modelos do Banco de Dados

### User
- `id` (Int) - Identificador único
- `name` (String) - Nome do usuário
- `email` (String) - Email único
- `createdAt` (DateTime) - Data de criação

### Article
- `id` (Int) - Identificador único
- `title` (String) - Título do artigo
- `content` (String) - Conteúdo
- `authorId` (Int) - Referência ao usuário
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Comment
- `id` (Int) - Identificador único
- `content` (String) - Texto do comentário
- `articleId` (Int) - Referência ao artigo
- `authorId` (Int) - Referência ao usuário
- `createdAt` (DateTime)

### Tag
- `id` (Int) - Identificador único
- `name` (String) - Nome da tag

## 🐳 Comandos Docker Úteis

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs do PostgreSQL
docker logs tech-blog-db

# Acessar o terminal do PostgreSQL
docker exec -it tech-blog-db psql -U postgres -d tech-blog-db

# Remover volumes (apagar dados)
docker-compose down -v
```

## 📞 Credenciais Padrão

| Serviço | Host | Port | User | Password |
|---------|------|------|------|----------|
| PostgreSQL | localhost | 5432 | postgres | postgres |
| PgAdmin | localhost | 5050 | admin@example.com | admin |

## 📄 Licença

Este projeto está sob a licença MIT.

## 📧 Testes

$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
