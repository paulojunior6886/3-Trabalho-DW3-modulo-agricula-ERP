# 3º Trabalho de Desenvolvimento Web III — AgroPasto ERP

### Desenvolvimento do módulo agrícola de pastejo rotacionado de um sistema ERP

Projeto acadêmico desenvolvido para a disciplina de **Desenvolvimento Web III**, do curso de **Bacharelado em Sistemas de Informação — IFSP, Campus Votuporanga**, sob orientação do professor **Dr. Evandro Jardini**.

O **AgroPasto ERP** é uma aplicação web para gerenciamento de pastos, piquetes, animais e suas alocações. O sistema segue a arquitetura **cliente-servidor**, com Front-End e Back-End em portas distintas, APIs REST, autenticação JWT e dados armazenados no PostgreSQL.

## Membros

- **Paulo Junior Walbueno dos Santos** — Módulos de Pastos e Piquetes.
- **Bruno de Morais Euzébio** — Módulos de Animais e Alocações.
- **Leonardo Teixeira Silva** — Banco de dados, autenticação, Docker e integração.

## Tecnologias utilizadas

- **Back-End:** Node.js, Express e JavaScript.
- **Front-End:** HTML, CSS, JavaScript, Nunjucks e template Acreage.
- **Banco de dados:** PostgreSQL e pgAdmin 4.
- **Autenticação:** JWT.
- **Infraestrutura:** Docker e Docker Compose.
- **Testes das APIs:** extensão REST Client do VS Code.

## Funcionalidades e estrutura do banco

O projeto contempla o CRUD (cadastrar, listar, consultar por ID, atualizar e excluir logicamente) das quatro tabelas agrícolas:

| Tabela | Finalidade |
| --- | --- |
| `pasto` | Cadastro e gerenciamento das áreas de pastagem. |
| `piquete` | Cadastro dos piquetes vinculados aos pastos (1:N). |
| `animal` | Cadastro e gerenciamento dos animais. |
| `alocado` | Registro das alocações de animais em piquetes (relacionamento N:N). |

A tabela `usuarios` é utilizada para autenticação e não integra a contagem das quatro tabelas do módulo agrícola.

A exclusão é **lógica (soft delete)**: o registro permanece no banco, com `removido = true`. O projeto também prevê validação de dependências ativas antes de remover pastos, piquetes ou animais.

> **Integração:** os módulos de Animais e Alocações devem ser conferidos após o merge final das alterações do grupo.

## Como executar

### Pré-requisitos

- Git.
- Docker Desktop (com Docker Compose).
- Navegador web.
- VS Code com a extensão REST Client, para executar os testes das APIs (opcional).

### 1. Clonar o repositório

```bash
git clone https://github.com/paulojunior6886/3-Trabalho-DW3-modulo-agricula-ERP.git
cd 3-Trabalho-DW3-modulo-agricula-ERP
```

### 2. Configurar as variáveis de ambiente

Na raiz do projeto, copie `.env.example` para `.env` e ajuste as senhas e a chave JWT. No terminal Bash/WSL:

```bash
cp .env.example .env
```

O arquivo `.env` contém dados locais e **não deve ser publicado no GitHub**.

### 3. Iniciar os contêineres

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

Para conferir os serviços:

```bash
docker compose ps
```

A configuração completa do projeto utiliza os serviços **PostgreSQL, pgAdmin, Back-End e Front-End**. Se aparecerem somente os dois serviços do banco, verifique se a versão completa do `docker-compose.yml` já foi integrada à sua branch.

### 4. Criar as tabelas no PostgreSQL

Acesse o pgAdmin e, no banco configurado em `DB_NAME`, execute o arquivo **`tabelas.sql`** usando o *Query Tool*. O banco padrão indicado em `.env.example` é `pastejo_rotacionado`.

Para disponibilizar um usuário de teste em um **ambiente exclusivamente acadêmico/local**, execute também:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO usuarios (username, password)
VALUES ('user1', crypt('1234', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;
```

Esse usuário/senha é somente para demonstração; não deve ser utilizado em produção. Em um banco já inicializado, não é necessário recriar as tabelas ou apagar os volumes.

### 5. Acessar o sistema

| Serviço | Endereço padrão |
| --- | --- |
| Front-End | http://localhost:40100/login |
| Back-End (API) | http://localhost:40000 |
| pgAdmin 4 | http://localhost:5050 |
| PostgreSQL (porta externa) | `localhost:5434` |

As portas do PostgreSQL e do pgAdmin são configuráveis pelo arquivo `.env`.

## Organização do código

```text
backend/
  app.js                     # Inicialização do Back-End
  routes/router.js           # Registro das APIs e proteção JWT
  database/databaseConfig.js # Conexão com o PostgreSQL
  login/                     # Autenticação e JWT
  pastos/                    # Controller e Model de Pastos
  piquetes/                  # Controller e Model de Piquetes
  animais/                   # Controller e Model de Animais (integração)
  alocados/                  # Controller e Model de Alocações (integração)
  test/                      # Requisições .rest

frontend/
  app.js                     # Rotas das páginas
  view/                      # Páginas Nunjucks
  apps/                      # JavaScript e fetch() dos módulos
  public/                    # CSS, JS e assets do template Acreage

tabelas.sql                  # Estrutura do banco de dados
docker-compose.yml           # Serviços Docker
Dockerfile.backend           # Imagem do Back-End
Dockerfile.frontend          # Imagem do Front-End
```

**Fluxo das operações:** navegador → `fetch()` no Front-End → rota no Back-End → middleware JWT → Controller → Model → PostgreSQL.

## Testes das APIs

Os arquivos de teste ficam em `backend/test/` e podem ser executados com a extensão **REST Client** no VS Code. Execute primeiro a requisição de login para obter o JWT e depois as requisições protegidas. Os módulos implementam os métodos **GET, POST, PUT e DELETE**, sendo DELETE utilizado para a exclusão lógica.

## Comandos úteis do Docker

```bash
# Parar sem apagar os dados
docker compose stop

# Iniciar novamente
docker compose start

# Verificar os contêineres
docker compose ps

# Ver os logs
docker compose logs --tail=80
```

**Atenção:** evite `docker compose down -v`, pois a opção `-v` remove os volumes e pode apagar os dados do PostgreSQL.

## Repositório

[3-Trabalho-DW3-modulo-agricula-ERP](https://github.com/paulojunior6886/3-Trabalho-DW3-modulo-agricula-ERP)

*Projeto acadêmico — IFSP Votuporanga.*