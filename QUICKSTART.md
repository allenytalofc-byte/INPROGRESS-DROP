# 🚀 Guia Rápido de Início

Este guia te ajudará a executar o projeto em **5 minutos**.

## ⚡ Início Rápido (Com Docker)

### 1. Pré-requisitos

```bash
# Verifique se tem instalado:
docker --version
docker-compose --version
node --version  # 18+
```

### 2. Clone e Configure

```bash
# Clone o repositório
git clone <repository-url>
cd dropshipping-monorepo

# Copie o arquivo de ambiente
cp .env.example .env

# Edite o .env e altere pelo menos:
# - JWT_SECRET (qualquer string longa e segura)
```

### 3. Inicie os Serviços

```bash
# Inicie o banco de dados e API
docker-compose up -d

# Aguarde ~30 segundos para o DB inicializar
# Verifique os logs
docker-compose logs -f api
```

### 4. Popule o Banco de Dados

```bash
# Entre no container da API
docker exec -it dropship-api sh

# Execute o seed
npm run build
npm run seed

# Saia do container
exit
```

### 5. Inicie os Frontends

#### Terminal 1 - Store Frontend
```bash
cd apps/store-frontend
npm install
cp .env.local.example .env.local
# Edite .env.local se necessário
npm run dev
```

#### Terminal 2 - Admin Panel
```bash
cd apps/admin-panel
npm install
npm run dev
```

## 🎉 Pronto!

Acesse:
- **Store**: http://localhost:3000
- **Admin Panel**: http://localhost:3002
- **API Docs**: http://localhost:3001/api/docs

## 🔑 Contas de Teste

```
Admin:    admin@dropship.com    / Admin@123
Vendor:   vendor@dropship.com   / Vendor@123
Customer: customer@dropship.com / Customer@123
```

## 🧪 Teste Rápido

### 1. Teste o Store
1. Acesse http://localhost:3000
2. Clique em "Cadastrar"
3. Crie uma conta
4. Navegue pelos produtos
5. Teste o tema dark/light

### 2. Teste o Admin Panel
1. Acesse http://localhost:3002
2. Login: `admin@dropship.com` / `Admin@123`
3. Veja o dashboard
4. Vá para "Produtos"
5. Tente criar um produto

### 3. Teste a API
```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dropship.com","password":"Admin@123"}'

# Copie o access_token e teste:
curl http://localhost:3001/products \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔧 Comandos Úteis

```bash
# Ver logs do Docker
docker-compose logs -f

# Parar serviços
docker-compose down

# Reiniciar apenas a API
docker-compose restart api

# Acessar banco de dados
docker exec -it dropship-postgres psql -U dropship_user -d dropship_db

# Importar produtos via CSV
cd services/workers
npm install
node import-csv.js example-products.csv <vendor-uuid>
```

## ❌ Problemas Comuns

### Porta já em uso
```bash
# Mude a porta no .env
API_PORT=3005

# Ou no docker-compose.yml
ports:
  - "3005:3001"
```

### API não conecta ao banco
```bash
# Aguarde o banco inicializar completamente
docker-compose logs postgres

# Ou reinicie os serviços
docker-compose down
docker-compose up -d
```

### Erro de permissão no Docker
```bash
# Linux: adicione seu usuário ao grupo docker
sudo usermod -aG docker $USER
# Faça logout e login novamente
```

## 📚 Próximos Passos

1. Leia o [README.md](README.md) completo
2. Configure o Firebase para notificações push
3. Explore a [API Docs](http://localhost:3001/api/docs)
4. Customize o design
5. Adicione suas próprias features

## 🆘 Precisa de Ajuda?

- Verifique os [logs](#comandos-úteis)
- Leia o README completo
- Abra uma issue no GitHub

---

**Boa sorte! 🚀**