# 🚀 Plataforma Completa de Dropshipping

Uma plataforma moderna e completa de dropshipping construída com **Next.js**, **NestJS**, **PostgreSQL** e **Firebase Cloud Messaging**.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Características](#características)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [API Documentation](#api-documentation)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)

## 🎯 Visão Geral

Este projeto é uma **plataforma completa de dropshipping** que inclui:

- **🛍️ Loja Online (Store Frontend)**: Interface de cliente para navegação e compra de produtos
- **👨‍💼 Painel Administrativo**: Dashboard para vendedores e administradores
- **🔧 Backend API**: API RESTful construída com NestJS
- **⚙️ Workers**: Scripts para importação em massa de produtos via CSV
- **🔔 Push Notifications**: Integração completa com Firebase Cloud Messaging

## ✨ Características

### Segurança e Autenticação
- ✅ Autenticação JWT completa
- ✅ Controle de acesso baseado em roles (Admin, Vendor, Customer)
- ✅ Hash de senhas com bcrypt
- ✅ Proteção CORS configurada
- ✅ Variáveis de ambiente para dados sensíveis

### Frontend (Store)
- ✅ Design moderno e responsivo com Tailwind CSS
- ✅ **Tema claro/escuro** com persistência
- ✅ Totalmente **acessível** (ARIA, navegação por teclado, contraste)
- ✅ Registro e login de usuários
- ✅ Página de perfil
- ✅ Catálogo de produtos com busca
- ✅ Integração com Firebase para push notifications

### Painel Administrativo
- ✅ Dashboard com estatísticas e gráficos
- ✅ Gerenciamento de produtos
- ✅ Gerenciamento de pedidos
- ✅ Envio de notificações push
- ✅ Perfil de vendedor
- ✅ Design responsivo e acessível

### Backend
- ✅ **NestJS** com arquitetura modular
- ✅ PostgreSQL com migrations SQL
- ✅ Documentação automática com **Swagger/OpenAPI**
- ✅ Endpoints RESTful completos
- ✅ Firebase Admin SDK para notificações
- ✅ Seed database para dados de teste

### Workers
- ✅ Importação em massa de produtos via CSV
- ✅ Suporte para atualização de produtos existentes
- ✅ Validação e tratamento de erros

## 🏗️ Arquitetura

```
dropshipping-monorepo/
├── apps/
│   ├── store-frontend/          # Loja Next.js
│   └── admin-panel/             # Painel Admin Next.js
├── services/
│   ├── api/                     # Backend NestJS
│   └── workers/                 # Scripts workers
└── infra/
    └── migrations/              # SQL migrations
```

## 📦 Pré-requisitos

- **Node.js** 18+ e npm
- **Docker** e Docker Compose
- **Git**
- Conta **Firebase** (opcional, para notificações push)

## 🛠️ Instalação

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd dropshipping-monorepo
```

### 2. Instale as Dependências

```bash
# Instalar dependências do monorepo
npm install

# Instalar dependências do backend
cd services/api
npm install

# Instalar dependências do worker
cd ../workers
npm install

# Instalar dependências do store frontend
cd ../../apps/store-frontend
npm install

# Instalar dependências do admin panel
cd ../admin-panel
npm install

cd ../..
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
POSTGRES_USER=dropship_user
POSTGRES_PASSWORD=dropship_password
POSTGRES_DB=dropship_db
DATABASE_URL=postgresql://dropship_user:dropship_password@postgres:5432/dropship_db

# JWT
JWT_SECRET=seu-secret-super-seguro-aqui
JWT_EXPIRES_IN=7d

# API
API_PORT=3001
NODE_ENV=development

# Firebase (opcional - para notificações push)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# Frontend URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

### 2. Configurar Firebase (Opcional)

Se você deseja usar notificações push:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative **Cloud Messaging**
4. Baixe as credenciais da conta de serviço
5. Configure as variáveis do Firebase no `.env`

### 3. Configurar Frontends

```bash
# Store Frontend
cd apps/store-frontend
cp .env.local.example .env.local
# Edite .env.local com suas configurações

# Admin Panel
cd ../admin-panel
cp .env.local.example .env.local
# Edite .env.local com suas configurações
```

## 🚀 Executando o Projeto

### Opção 1: Com Docker (Recomendado)

```bash
# Subir todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

O banco de dados será inicializado automaticamente com as migrations.

### Opção 2: Desenvolvimento Local

#### 1. Iniciar Banco de Dados

```bash
docker-compose up postgres -d
```

#### 2. Aplicar Migrations

```bash
# As migrations são aplicadas automaticamente quando o container inicia
# Ou manualmente:
docker exec -i dropship-postgres psql -U dropship_user -d dropship_db < infra/migrations/001_init.sql
```

#### 3. Seed do Banco de Dados

```bash
cd services/api
npm run build
npm run seed
```

**Contas criadas:**
- **Admin**: `admin@dropship.com` / `Admin@123`
- **Vendor**: `vendor@dropship.com` / `Vendor@123`
- **Customer**: `customer@dropship.com` / `Customer@123`

#### 4. Iniciar Backend

```bash
cd services/api
npm run dev
# API rodando em http://localhost:3001
# Swagger docs em http://localhost:3001/api/docs
```

#### 5. Iniciar Store Frontend

```bash
cd apps/store-frontend
npm run dev
# Store rodando em http://localhost:3000
```

#### 6. Iniciar Admin Panel

```bash
cd apps/admin-panel
npm run dev
# Admin panel rodando em http://localhost:3002
```

## 📁 Estrutura do Projeto

```
dropshipping-monorepo/
├── .env                          # Variáveis de ambiente
├── .env.example                  # Exemplo de variáveis
├── docker-compose.yml            # Configuração Docker
├── package.json                  # Workspace raiz
│
├── apps/
│   ├── store-frontend/           # Loja (Next.js)
│   │   ├── src/
│   │   │   ├── app/             # Pages e layouts
│   │   │   ├── components/      # Componentes React
│   │   │   ├── contexts/        # Contexts (Auth)
│   │   │   └── lib/             # Utilitários (API, Firebase)
│   │   ├── public/              # Assets estáticos
│   │   └── package.json
│   │
│   └── admin-panel/              # Painel Admin (Next.js)
│       ├── src/
│       │   ├── app/             # Pages e layouts
│       │   ├── components/      # Componentes React
│       │   ├── contexts/        # Contexts (Auth)
│       │   └── lib/             # Utilitários (API)
│       └── package.json
│
├── services/
│   ├── api/                      # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/            # Módulo de autenticação
│   │   │   ├── users/           # Módulo de usuários
│   │   │   ├── products/        # Módulo de produtos
│   │   │   ├── orders/          # Módulo de pedidos
│   │   │   ├── devices/         # Módulo de dispositivos
│   │   │   ├── notifications/   # Módulo de notificações
│   │   │   ├── database/        # Configuração do DB
│   │   │   ├── main.ts          # Entry point
│   │   │   └── seed.ts          # Script de seed
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── workers/                  # Workers
│       ├── import-csv.js        # Importador CSV
│       ├── example-products.csv # Exemplo de CSV
│       └── package.json
│
└── infra/
    └── migrations/
        └── 001_init.sql         # Schema do banco
```

## 🎨 Funcionalidades

### Store Frontend (Loja)

#### Páginas Principais
- **Home** (`/`): Catálogo de produtos com busca
- **Login** (`/login`): Autenticação de clientes
- **Registro** (`/register`): Cadastro de novos clientes
- **Perfil** (`/profile`): Gerenciamento de perfil do usuário

#### Recursos
- 🌓 **Tema Dark/Light**: Toggle persistente entre modos
- ♿ **Acessibilidade**: ARIA labels, navegação por teclado, alto contraste
- 📱 **Responsivo**: Design adaptativo para mobile, tablet e desktop
- 🔔 **Push Notifications**: Registro automático de device token
- 🔒 **Autenticação**: JWT com renovação automática

### Admin Panel

#### Páginas Principais
- **Dashboard** (`/dashboard`): Visão geral com estatísticas
- **Produtos** (`/dashboard/products`): CRUD de produtos
- **Pedidos** (`/dashboard/orders`): Gerenciamento de pedidos
- **Notificações** (`/dashboard/notifications`): Envio de push notifications
- **Perfil** (`/dashboard/profile`): Perfil do vendedor/admin

#### Recursos
- 📊 **Dashboard**: Gráficos e métricas em tempo real
- 🎨 **Design Moderno**: Interface intuitiva e profissional
- 🌓 **Tema Dark/Light**: Suporte completo
- 📱 **Sidebar Responsiva**: Menu adaptativo para mobile
- 🔐 **Controle de Acesso**: Separação entre admin e vendor

### Backend API

#### Endpoints Principais

**Autenticação**
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login

**Usuários**
- `GET /users/me` - Perfil atual
- `PUT /users/me` - Atualizar perfil
- `GET /users` - Listar usuários (admin)

**Produtos**
- `GET /products` - Listar produtos
- `GET /products/:id` - Detalhes do produto
- `POST /products` - Criar produto (vendor/admin)
- `PUT /products/:id` - Atualizar produto (vendor/admin)
- `DELETE /products/:id` - Deletar produto (vendor/admin)

**Pedidos**
- `GET /orders` - Listar pedidos
- `GET /orders/:id` - Detalhes do pedido
- `POST /orders` - Criar pedido
- `PUT /orders/:id/status` - Atualizar status (vendor/admin)

**Notificações**
- `GET /notifications` - Listar notificações
- `POST /notifications/send` - Enviar para usuário (admin/vendor)
- `POST /notifications/broadcast` - Enviar para múltiplos (admin)
- `PUT /notifications/:id/read` - Marcar como lida

**Dispositivos**
- `POST /devices/register` - Registrar token FCM
- `GET /devices` - Listar dispositivos
- `DELETE /devices/:token` - Desativar dispositivo

#### Documentação Swagger

Acesse a documentação interativa em:
```
http://localhost:3001/api/docs
```

### Workers

#### Importação CSV

Importe produtos em massa:

```bash
cd services/workers
npm install

# Formato: node import-csv.js <arquivo.csv> <vendor_id>
node import-csv.js example-products.csv <seu-vendor-uuid>
```

**Formato do CSV:**
```csv
name,description,price,compare_at_price,cost,sku,barcode,stock_quantity,category,tags,image_url
"Product Name","Description",99.99,129.99,50.00,SKU123,1234567890,100,Category,"tag1,tag2",https://image.url
```

## 🧪 Testes

### Fluxo de Teste Completo

#### 1. Testar API

```bash
# Verificar saúde da API
curl http://localhost:3001/api/docs

# Fazer login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dropship.com","password":"Admin@123"}'
```

#### 2. Testar Store

1. Acesse `http://localhost:3000`
2. Clique em "Cadastrar"
3. Crie uma conta de cliente
4. Navegue pelos produtos
5. Vá para "Perfil"
6. Teste o toggle dark/light

#### 3. Testar Admin Panel

1. Acesse `http://localhost:3002`
2. Faça login com `admin@dropship.com` / `Admin@123`
3. Veja as estatísticas no dashboard
4. Teste criar um produto
5. Envie uma notificação de teste

#### 4. Testar Notificações Push

1. No Store, faça login
2. Permita notificações quando solicitado
3. No Admin Panel, vá para "Notificações"
4. Copie seu user ID do perfil
5. Envie uma notificação para seu ID
6. Verifique se recebeu no Store

## 🔐 Segurança

### Boas Práticas Implementadas

- ✅ Senhas hashadas com bcrypt (10 rounds)
- ✅ JWT com expiração configurável
- ✅ Validação de dados com class-validator
- ✅ CORS configurado para URLs específicas
- ✅ Variáveis sensíveis em `.env`
- ✅ SQL injection protegido (prepared statements)
- ✅ Rate limiting (adicionar em produção)
- ✅ HTTPS (configurar em produção)

### Checklist de Produção

Antes de fazer deploy:

- [ ] Alterar `JWT_SECRET` para valor forte e único
- [ ] Alterar senhas do banco de dados
- [ ] Configurar HTTPS/SSL
- [ ] Ativar rate limiting
- [ ] Configurar backup do banco
- [ ] Revisar permissões de CORS
- [ ] Configurar monitoramento
- [ ] Implementar logs centralizados

## 🚢 Deploy

### Deploy com Docker

```bash
# Build das imagens
docker-compose build

# Deploy em produção
docker-compose -f docker-compose.prod.yml up -d
```

### Deploy dos Frontends

#### Vercel (Recomendado)

```bash
# Store Frontend
cd apps/store-frontend
vercel

# Admin Panel
cd apps/admin-panel
vercel
```

#### Variáveis de Ambiente na Vercel

Configure no dashboard:
- `NEXT_PUBLIC_API_URL`
- Todas as variáveis do Firebase

### Deploy do Backend

#### Opções:
- **Railway**: Upload do Dockerfile
- **Render**: Deploy automático do GitHub
- **AWS ECS**: Container orchestration
- **DigitalOcean App Platform**

## 🌐 Expansões Futuras

### Planejadas
- [ ] Integração com gateways de pagamento (Stripe, PayPal)
- [ ] Sistema de cupons e promoções
- [ ] Integração com APIs de marketplaces (Shopify, AliExpress)
- [ ] Analytics e relatórios avançados
- [ ] Sistema de reviews e avaliações
- [ ] Chat de suporte ao cliente
- [ ] Multi-idioma (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados (Jest, Cypress)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 💬 Suporte

Para dúvidas e suporte:
- Abra uma [Issue](../../issues)
- Entre em contato: support@dropship.com

---

**Feito com ❤️ usando Next.js, NestJS, PostgreSQL e Firebase**