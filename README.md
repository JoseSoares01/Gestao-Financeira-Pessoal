# FinControl - Controle Financeiro Pessoal

Aplicação completa de gestão financeira pessoal com backend em Node.js/Express e frontend em React + Bootstrap.

## 🚀 Configuração do Banco de Dados (Supabase)

### 1. Criar conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta gratuita (pode usar GitHub, Google ou email)
3. Clique em "New Project"
4. Escolha um nome para o projeto (ex: "fincontrol")
5. Selecione a região mais próxima de você
6. Clique em "Create new project"

### 2. Configurar o Banco de Dados

1. No painel do Supabase, vá para "SQL Editor"
2. Clique em "New query"
3. Cole o conteúdo do arquivo `backend/database.sql`
4. Clique em "Run" para criar as tabelas

### 3. Obter as Credenciais

1. No painel do Supabase, vá para "Project Settings" (ícone de engrenagem)
2. Clique em "API" no menu lateral
3. Copie:
   - **URL** (ex: `https://xxxxxx.supabase.co`)
   - **anon public** key (começa com `eyJ...`)

### 4. Configurar o Backend

1. No arquivo `backend/.env`, adicione:
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-aqui
PORT=3001
```

2. Instale as dependências:
```bash
cd backend
npm install
```

3. Inicie o servidor:
```bash
npm start
```

### 5. Configurar o Frontend

1. No arquivo `app/.env`, adicione:
```
VITE_API_URL=http://localhost:3001/api
```

2. Instale as dependências:
```bash
cd app
npm install
```

3. Inicie o frontend:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
/mnt/okcomputer/output/
├── app/                    # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # APIs e serviços
│   │   ├── hooks/          # Custom hooks
│   │   └── types/          # TypeScript types
│   └── ...
├── backend/                # Backend Node.js
│   ├── server.js           # Servidor Express
│   ├── database.sql        # Schema do banco
│   └── ...
└── README.md
```

## 🔌 APIs Disponíveis

### Transações
- `GET /api/transactions` - Listar todas as transações
- `GET /api/transactions/:id` - Obter transação específica
- `POST /api/transactions` - Criar nova transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Excluir transação

### Resumo
- `GET /api/summary` - Obter resumo financeiro
- `GET /api/summary?period=month` - Resumo por período (day, month, semester, year)

### Categorias
- `GET /api/categories` - Listar categorias com valores

### Dados Mensais
- `GET /api/monthly-data` - Dados para gráficos

### Metas
- `GET /api/goals` - Listar metas
- `POST /api/goals` - Criar meta
- `PUT /api/goals/:id` - Atualizar meta
- `DELETE /api/goals/:id` - Excluir meta

## 🌐 Deploy

### Backend (Render/Railway/Heroku)
1. Crie uma conta na plataforma escolhida
2. Conecte seu repositório Git
3. Configure as variáveis de ambiente (SUPABASE_URL, SUPABASE_KEY)
4. Deploy!

### Frontend (Vercel/Netlify)
1. Crie uma conta na plataforma escolhida
2. Conecte seu repositório Git
3. Configure a variável VITE_API_URL apontando para seu backend
4. Deploy!

## 📝 Licença

MIT License - José Luiza
