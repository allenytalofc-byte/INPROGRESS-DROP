# 🚀 Dropshipping Platform - Monorepo Completo

Uma plataforma completa de dropshipping com frontend da loja, painel administrativo, backend API e workers de importação. Construída com tecnologias modernas e pronta para produção.

## ✨ Características Principais

### 🏪 Store Frontend (Next.js)
- **Design Responsivo**: Mobile-first com Tailwind CSS
- **Tema Dark/Light**: Toggle automático baseado nas preferências do sistema
- **Acessibilidade**: WCAG 2.1 AA compliant com navegação por teclado
- **Autenticação JWT**: Login/registro integrado
- **Notificações Push**: Firebase Cloud Messaging
- **Busca Avançada**: Filtros por categoria, preço e ordenação
- **PWA Ready**: Service Worker e manifest.json incluídos

### 🎛️ Admin Panel (Next.js)
- **Dashboard Completo**: Métricas e estatísticas em tempo real
- **Gerenciamento de Produtos**: CRUD completo com upload de imagens
- **Gestão de Pedidos**: Acompanhamento de status e processamento
- **Sistema de Notificações**: Envio de push notifications para usuários
- **Controle de Usuários**: Gerenciamento de roles (admin/supplier/customer)
- **Interface Intuitiva**: Sidebar responsiva e componentes acessíveis

### 🔧 Backend API (NestJS)
- **Arquitetura Modular**: Módulos bem organizados e escaláveis
- **Autenticação JWT**: Sistema robusto com refresh tokens
- **Controle de Roles**: RBAC (Role-Based Access Control)
- **Documentação OpenAPI**: Swagger UI integrado
- **Validação de Dados**: Class-validator para DTOs
- **Banco de Dados**: PostgreSQL com TypeORM
- **Cache Redis**: Para sessões e performance

### ⚙️ Workers (Node.js)
- **Importação CSV**: Processamento em massa de produtos
- **Sincronização de Estoque**: Integração com APIs de fornecedores
- **Tarefas Agendadas**: Cron jobs para manutenção automática
- **Processamento de Pedidos**: Workflow automatizado
- **Alertas de Estoque**: Notificações automáticas para fornecedores

## 🏗️ Arquitetura

```
dropshipping-monorepo/
├── apps/
│   ├── store-frontend/          # Loja para clientes (Next.js)
│   └── admin-panel/             # Painel administrativo (Next.js)
├── services/
│   ├── api/                     # Backend API (NestJS)
│   └── workers/                 # Workers de background (Node.js)
├── infra/
│   └── migrations/              # Migrations SQL
├── docker-compose.yml           # Orquestração de containers
├── .env.example                # Variáveis de ambiente
└── README.md                   # Esta documentação
```

## 🚀 Quick Start

### 1. Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- Git

### 2. Configuração Inicial
```bash
# Clone o repositório
git clone <repository-url>
cd dropshipping-monorepo

# Copie o arquivo de ambiente
cp .env.example .env

# Edite as variáveis de ambiente
nano .env
```

### 3. Instalação de Dependências
```bash
# Instale todas as dependências
npm run install:all
```

### 4. Configuração do Banco de Dados
```bash
# Inicie os containers
npm run docker:up

# Aguarde o banco estar pronto (30 segundos)
sleep 30

# Execute as migrations
npm run migrate

# Crie usuários iniciais
npm run seed
```

### 5. Iniciar Desenvolvimento
```bash
# Inicie todos os serviços
npm run dev
```

### 6. Acessar as Aplicações
- **Store Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API Documentation**: http://localhost:3002/api/docs
- **Database**: localhost:5432

## 🔐 Contas de Teste

Após executar `npm run seed`:

### Admin
- **Email**: admin@dropshipping.com
- **Senha**: admin123
- **Acesso**: Painel administrativo completo

### Fornecedor
- **Email**: supplier@dropshipping.com
- **Senha**: supplier123
- **Acesso**: Gestão de produtos e pedidos

## 📱 Funcionalidades Detalhadas

### Store Frontend
- ✅ Registro e login de usuários
- ✅ Catálogo de produtos com busca
- ✅ Filtros avançados (categoria, preço, ordenação)
- ✅ Perfil do usuário editável
- ✅ Tema dark/light automático
- ✅ Notificações push (Firebase)
- ✅ Design responsivo e acessível
- ✅ PWA com Service Worker

### Admin Panel
- ✅ Dashboard com métricas
- ✅ CRUD de produtos
- ✅ Gestão de pedidos
- ✅ Sistema de notificações
- ✅ Controle de usuários
- ✅ Interface responsiva
- ✅ Controle de roles

### Backend API
- ✅ Autenticação JWT
- ✅ CRUD completo de entidades
- ✅ Validação de dados
- ✅ Documentação Swagger
- ✅ Middleware de segurança
- ✅ Rate limiting
- ✅ Logs estruturados

### Workers
- ✅ Importação CSV de produtos
- ✅ Sincronização de estoque
- ✅ Processamento de pedidos
- ✅ Alertas automáticos
- ✅ Tarefas agendadas

## 🔧 Configuração de Ambiente

### Variáveis Obrigatórias
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=dropshipping_db
DATABASE_USER=dropshipping_user
DATABASE_PASSWORD=dropshipping_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Firebase (para notificações push)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### Firebase Setup
1. Crie um projeto no Firebase Console
2. Ative o Cloud Messaging
3. Gere uma chave de serviço
4. Configure as variáveis no `.env`

## 📊 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Inicia todos os serviços
npm run dev:store        # Apenas store frontend
npm run dev:admin        # Apenas admin panel
npm run dev:api          # Apenas backend API
```

### Build e Deploy
```bash
npm run build            # Build de todos os projetos
npm run build:store      # Build store frontend
npm run build:admin      # Build admin panel
npm run build:api        # Build backend API
```

### Database
```bash
npm run migrate          # Executa migrations
npm run seed             # Cria dados iniciais
```

### Docker
```bash
npm run docker:up        # Inicia containers
npm run docker:down      # Para containers
npm run docker:logs      # Visualiza logs
```

## 🧪 Testando Notificações Push

1. **Login no Store Frontend**
2. **Permita notificações** quando solicitado pelo navegador
3. **Login no Admin Panel**
4. **Vá para Notifications**
5. **Envie uma notificação de teste**
6. **Verifique se chegou** no frontend

## 🚀 Deploy em Produção

### 1. Build para Produção
```bash
npm run build
```

### 2. Configurar Variáveis de Produção
```bash
# Copie e configure para produção
cp .env.example .env.production
```

### 3. Deploy com Docker
```bash
# Use docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Configurar Domínio
- Configure DNS para apontar para seu servidor
- Configure SSL/TLS (Let's Encrypt recomendado)
- Configure proxy reverso (Nginx)

## 🔒 Segurança

### Implementado
- ✅ Hash de senhas com bcrypt
- ✅ Autenticação JWT com expiração
- ✅ Validação de entrada de dados
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Headers de segurança (Helmet)
- ✅ Sanitização de dados

### Recomendações Adicionais
- 🔐 Use HTTPS em produção
- 🔐 Configure firewall adequadamente
- 🔐 Monitore logs de segurança
- 🔐 Implemente backup automático
- 🔐 Use secrets management

## 📈 Monitoramento

### Logs
- **API**: Logs estruturados com Winston
- **Workers**: Logs de tarefas agendadas
- **Frontend**: Console logs para debug

### Métricas
- **Performance**: Tempo de resposta da API
- **Uso**: Número de usuários ativos
- **Erros**: Taxa de erro por endpoint

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

### Problemas Comuns

**Erro de conexão com banco:**
```bash
# Verifique se o container está rodando
docker ps
# Reinicie se necessário
npm run docker:down && npm run docker:up
```

**Erro de permissão Firebase:**
- Verifique se as credenciais estão corretas no `.env`
- Confirme se o projeto Firebase está ativo

**Problemas de build:**
```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Contato
- 📧 Email: support@dropshipping.com
- 💬 Discord: [Link do servidor]
- 📖 Wiki: [Link da documentação]

---

## 🎯 Roadmap

### Próximas Features
- [ ] Sistema de avaliações de produtos
- [ ] Integração com gateways de pagamento
- [ ] Dashboard de analytics avançado
- [ ] Sistema de cupons e descontos
- [ ] Chat em tempo real
- [ ] Integração com marketplaces (Shopify, WooCommerce)
- [ ] App mobile (React Native)
- [ ] Sistema de afiliados

### Melhorias Técnicas
- [ ] Testes automatizados (Jest, Cypress)
- [ ] CI/CD pipeline
- [ ] Monitoramento com Prometheus
- [ ] Cache distribuído (Redis Cluster)
- [ ] CDN para assets estáticos
- [ ] Microserviços para escalabilidade

---

**Desenvolvido com ❤️ pela equipe Dropshipping**