# Dashboard Causa Animal

Projeto desenvolvido pelo **RAITec — UFC** para modernizar a visualização de dados do coletivo **Animais Universitários (AUS)**.

A aplicação disponibiliza indicadores de animais acompanhados e registros de adoções, abandonos, castrações e óbitos. A primeira versão é voltada à **consulta e visualização**; funcionalidades de cadastro, autenticação e gerenciamento poderão ser implementadas futuramente.

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| React + TypeScript | Interface da dashboard |
| Vite | Ambiente de desenvolvimento do frontend |
| Recharts | Gráficos (conforme componentes do frontend) |
| FastAPI + Uvicorn | API HTTP em Python |
| psycopg | Conexão Python com PostgreSQL |
| openpyxl | Leitura da planilha de dados |
| PostgreSQL 17 | Banco de dados |
| Docker Compose | Inicialização do PostgreSQL |

## Estrutura do projeto

```text
Dashboard_Raitec-CausaAnimal/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── routes/
│   │   ├── models/
│   │   └── services/
│   ├── dados/                  # Planilha local (não versionada)
│   ├── scripts/
│   │   └── importar_planilha.py
│   └── requirements.txt
├── frontend/
├── database/
│   └── init.sql
├── compose.yaml
├── .env.example
├── .gitignore
└── README.md
```

## Pré-requisitos

- Git
- Python 3.11 ou superior
- Node.js e npm
- Docker Desktop com Docker Compose
- PowerShell (os comandos abaixo são para Windows)

## Primeira instalação

Execute os comandos em um terminal PowerShell, na ordem indicada.

### 1. Clonar o projeto

```powershell
git clone URL_DO_REPOSITORIO
cd Dashboard_Raitec-CausaAnimal
```

Substitua `URL_DO_REPOSITORIO` pela URL do repositório.

### 2. Criar o arquivo de ambiente

Na raiz do projeto:

```powershell
Copy-Item .env.example .env
```

Abra `.env` e **substitua `troque_por_uma_senha_forte` por uma senha própria** antes de iniciar o banco:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=dashboard_causaanimal
DB_USER=postgres
DB_PASSWORD=troque_por_uma_senha_forte
```

O arquivo `.env` é local e não deve ser versionado. **Não altere apenas `DB_PASSWORD` depois de inicializar o banco:** a senha do PostgreSQL persistido no volume não muda automaticamente.

### 3. Baixar a imagem e iniciar o PostgreSQL

Abra o Docker Desktop e aguarde o Docker ficar disponível. Na raiz do projeto:

```powershell
docker compose pull db
docker compose up -d db
docker compose ps
```

- `pull db`: baixa a imagem `postgres:17` definida no `compose.yaml`.
- `up -d db`: cria/inicia o contêiner em segundo plano.
- `ps`: mostra o estado do serviço (aguarde aparecer `healthy`).

Na **primeira inicialização**, o PostgreSQL cria o banco e executa `database/init.sql` automaticamente. O script não é reexecutado ao reiniciar um volume que já contém dados.

**Atenção:** a porta local `5432` deve estar livre. Se outro PostgreSQL estiver utilizando essa porta, interrompa o serviço conflitante ou ajuste a publicação da porta e o `DB_PORT` de forma consistente.

### 4. Preparar o ambiente Python

Ainda na raiz do projeto:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend/requirements.txt
```

O ambiente virtual `.venv` é local e não deve ir para o Git.

### 5. Importar os dados iniciais

Solicite a planilha autorizada à equipe e coloque-a neste caminho exato:

```text
backend/dados/AU 2024 RAITEC.xlsx
```

Com o Docker ativo e o ambiente virtual ativado:

```powershell
cd backend
python -m scripts.importar_planilha
cd ..
```

A importação cadastra animais e ocorrências. **Execute uma única vez para cada banco novo:** o script impede nova importação caso encontre registros do AUS, para evitar duplicações.

Se você não tiver a planilha, a API poderá iniciar, mas as tabelas estarão vazias.

### 6. Iniciar a API

Em um terminal na raiz do projeto, com `.venv` ativo:

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

- API: http://127.0.0.1:8000
- Documentação Swagger: http://127.0.0.1:8000/docs
- Animais: http://127.0.0.1:8000/api/animais/

A rota `/api/animais/` retorna os registros em JSON. As rotas de ocorrências e estatísticas devem ser documentadas à medida que forem implementadas.

### 7. Iniciar o frontend

Abra **outro terminal**, na raiz do projeto:

```powershell
cd frontend
npm ci
npm run dev
```

Acesse http://localhost:5173. O comando `npm ci` pressupõe um `package-lock.json` versionado; se ele ainda não existir, execute `npm install` e inclua o lockfile no Git.

## Comandos úteis

Execute comandos do Docker na raiz do projeto:

| Comando | Função |
|---|---|
| `docker compose pull db` | Baixa a imagem PostgreSQL |
| `docker compose up -d db` | Inicia o banco de dados |
| `docker compose ps` | Verifica o estado do contêiner |
| `docker compose logs -f db` | Acompanha os logs do banco |
| `docker compose exec db psql -U postgres -d dashboard_causaanimal` | Abre o PostgreSQL dentro do contêiner |
| `docker compose down` | Para e remove contêineres; preserva o volume |
| `python -m uvicorn app.main:app --reload` | Inicia a API (dentro de `backend`) |
| `npm run dev` | Inicia o frontend (dentro de `frontend`) |

Para listar tabelas dentro do `psql`, use `\dt`. Para sair, `\q`.

> **Não use `docker compose down -v` sem intenção explícita de apagar os dados:** `-v` remove também o volume do PostgreSQL.

## Dados e versionamento

- **Versionar:** código-fonte, `database/init.sql`, `compose.yaml`, `README.md`, `requirements.txt`, `.env.example` e arquivos de lock de dependências.
- **Não versionar:** `.env`, senhas, `.venv`, `node_modules`, volumes de dados, arquivos exportados e a planilha original de animais.
- A planilha deve ser obtida por um canal autorizado da equipe. Antes de disponibilizar qualquer base publicamente, revisar dados pessoais e sensíveis.

## Estado atual

- Banco de dados PostgreSQL com tabelas `coletivos`, `animais` e `ocorrencias`.
- Importação de planilha para o banco.
- API FastAPI com rota de listagem de animais.
- Interface React em desenvolvimento.

## Desenvolvimento

Projeto de extensão do **RAITec**, da **Universidade Federal do Ceará (UFC)**, dedicado à aplicação de tecnologia em iniciativas de impacto social.
