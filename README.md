# SGHSS - Sistema de Gestão Hospitalar e de Serviços de Saúde (VidaPlus)

![NestJS](https://img.shields.io/badge/NestJS-10.3.0-red?style=for-the-badge&logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-5.8.0-blue?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-10.2.0-purple?style=for-the-badge&logo=jsonwebtokens)
![LGPD](https://img.shields.io/badge/Conformidade-LGPD-brightgreen?style=for-the-badge)

API RESTful desenvolvida como parte de um projeto acadêmico, utilizando **NestJS**, **Prisma**, **PostgreSQL** e as melhores práticas de desenvolvimento de software, incluindo segurança, conformidade com a LGPD e documentação técnica.

---

## 🎯 Objetivo do Projeto

O objetivo principal é desenvolver o Back-end de um sistema de gestão hospitalar, demonstrando competências em:

-   **Arquitetura de Software**: Estrutura modular, separação de responsabilidades e injeção de dependências.
-   **Desenvolvimento Back-end**: Criação de uma API REST funcional com NestJS e TypeScript.
-   **Persistência de Dados**: Uso do Prisma ORM para interagir com um banco de dados PostgreSQL.
-   **Segurança da Informação**: Implementação de autenticação com JWT, criptografia de senhas com bcrypt e proteção de rotas.
-   **Conformidade Legal (LGPD)**: Implementação de logs de auditoria e exclusão lógica (soft delete) para garantir a proteção de dados pessoais sensíveis.
-   **Documentação Técnica**: Documentação de API com Swagger/OpenAPI.

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia | Versão |
| :--- | :--- | :--- |
| **Framework** | NestJS | `10.3.0` |
| **Linguagem** | TypeScript | `5.3.3` |
| **Banco de Dados** | PostgreSQL | `15` |
| **ORM** | Prisma | `5.8.0` |
| **Autenticação** | JWT (JSON Web Token) | `10.2.0` |
| **Criptografia** | bcrypt | `5.1.1` |
| **Validação** | class-validator | `0.14.1` |
| **Documentação** | Swagger (OpenAPI) | `7.2.0` |

## 📂 Estrutura do Projeto

A estrutura de pastas segue o padrão modular do NestJS, com separação clara de responsabilidades:

```
src/
├── auth/          # Módulo de autenticação (login, registro, JWT)
│   ├── dto/
│   └── strategies/
├── patients/      # Módulo de pacientes (CRUD com soft delete)
│   └── dto/
├── audit/         # Módulo de auditoria (logs de operações)
├── common/        # Componentes compartilhados
│   ├── filters/   # Filtros de exceção globais
│   └── interceptors/ # Interceptores globais (ex: auditoria)
├── prisma.service.ts # Serviço de conexão com o Prisma
├── app.module.ts     # Módulo principal
└── main.ts           # Ponto de entrada da aplicação
prisma/
├── schema.prisma   # Schema do banco de dados
└── seed.ts         # Script para popular o banco com dados iniciais
```

## ✨ Funcionalidades Implementadas

### Autenticação e Segurança

-   **Registro de Usuários**: Endpoint para cadastrar novos usuários (administradores, médicos, etc.).
-   **Login com JWT**: Geração de token JWT na autenticação para acesso a rotas protegidas.
-   **Criptografia de Senhas**: Senhas são armazenadas de forma segura usando o algoritmo `bcrypt`.
-   **Proteção de Rotas**: Uso de `Guards` do NestJS para garantir que apenas usuários autenticados acessem determinados endpoints.

### Gerenciamento de Pacientes

-   **CRUD Completo**: Operações de Criar, Ler, Atualizar e Deletar pacientes.
-   **Soft Delete (LGPD)**: Ao deletar um paciente, ele é apenas marcado como `deletedAt` no banco de dados, em conformidade com o Art. 16 da LGPD, permitindo a recuperação de dados e a manutenção de históricos.

### Auditoria (LGPD)

-   **Logs de Operações**: Todas as operações críticas (login, criação, atualização e exclusão de pacientes) são registradas em uma tabela `audit_logs`.
-   **Rastreabilidade**: Cada log de auditoria armazena o usuário responsável, a ação realizada, o endereço IP e detalhes da operação, garantindo conformidade com o Art. 37 da LGPD.

### Qualidade de Código

-   **Validação de Dados**: Uso de `class-validator` e `ValidationPipe` para garantir que todos os dados recebidos pela API sejam válidos.
-   **Tratamento de Erros**: Um `HttpExceptionFilter` global padroniza todas as respostas de erro da API, melhorando a experiência do desenvolvedor que consome a API.
-   **Documentação Swagger**: A API é autodocumentada usando Swagger, acessível em `/api/docs`.

## Como Executar o Projeto

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 18.x ou superior)
-   [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/)
-   Um cliente de API como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/)

### 1. Clonar o Repositório

```bash
git clone https://github.com/suarezzzs/sghss-vidaplus.git
cd sghss-vidaplus
```

### 2. Configurar Variáveis de Ambiente

Crie uma cópia do arquivo `.env.example` e renomeie para `.env`:

```bash
cp .env.example .env
```

O arquivo `.env` já vem pré-configurado para usar o banco de dados Docker.

### 3. Instalar Dependências

```bash
npm install
```

### 4. Iniciar o Banco de Dados com Docker

Para facilitar a configuração, um arquivo `docker-compose.yml` está incluído para iniciar um container PostgreSQL:

```bash
docker-compose up -d
```

### 5. Aplicar as Migrations do Prisma

Este comando irá criar as tabelas no banco de dados com base no `schema.prisma`:

```bash
npx prisma migrate dev --name init
```

### 6. Popular o Banco de Dados (Seed)

Este comando irá executar o script `prisma/seed.ts` para criar usuários e pacientes de exemplo:

```bash
npx prisma db seed
```

### 7. Iniciar a Aplicação

```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

## 📚 Documentação da API (Swagger)

Após iniciar a aplicação, a documentação completa da API, gerada pelo Swagger, pode ser acessada em:

**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

Lá você encontrará todos os endpoints, DTOs e exemplos de uso.

## 🧪 Testando a API

1.  **Registre um usuário**: Use o endpoint `POST /auth/register` para criar um novo usuário.
2.  **Faça login**: Use o endpoint `POST /auth/login` com as credenciais criadas para obter um `access_token`.
3.  **Autentique as requisições**: Para acessar os endpoints protegidos (como os de pacientes), adicione o `access_token` no header `Authorization` como `Bearer [SEU_TOKEN]`.

