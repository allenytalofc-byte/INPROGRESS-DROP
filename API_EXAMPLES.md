# 🔌 Exemplos de Uso da API

Exemplos práticos de como usar a API REST.

## 🔐 Autenticação

### Registrar Novo Usuário

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "SenhaForte123!",
    "name": "João Silva",
    "role": "customer",
    "phone": "+55 11 98765-4321"
  }'
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-aqui",
    "email": "joao@example.com",
    "name": "João Silva",
    "role": "customer"
  }
}
```

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dropship.com",
    "password": "Admin@123"
  }'
```

## 👤 Usuários

### Obter Perfil Atual

```bash
curl http://localhost:3001/users/me \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Atualizar Perfil

```bash
curl -X PUT http://localhost:3001/users/me \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Santos",
    "phone": "+55 11 91234-5678"
  }'
```

### Listar Todos os Usuários (Admin)

```bash
curl http://localhost:3001/users \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

## 📦 Produtos

### Listar Produtos

```bash
# Todos os produtos
curl http://localhost:3001/products

# Filtrar por categoria
curl http://localhost:3001/products?category=Electronics

# Buscar por nome
curl http://localhost:3001/products?search=wireless

# Limitar resultados
curl http://localhost:3001/products?limit=10
```

### Detalhes do Produto

```bash
curl http://localhost:3001/products/PRODUCT_ID
```

### Criar Produto (Vendor/Admin)

```bash
curl -X POST http://localhost:3001/products \
  -H "Authorization: Bearer TOKEN_VENDOR" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone Premium",
    "description": "Smartphone de última geração com câmera de 108MP",
    "price": 2999.99,
    "compare_at_price": 3999.99,
    "cost": 1500.00,
    "sku": "PHONE-2024-001",
    "barcode": "7891234567890",
    "stock_quantity": 50,
    "category": "Electronics",
    "tags": ["smartphone", "premium", "camera"],
    "image_url": "https://example.com/smartphone.jpg",
    "weight": 0.2
  }'
```

### Atualizar Produto

```bash
curl -X PUT http://localhost:3001/products/PRODUCT_ID \
  -H "Authorization: Bearer TOKEN_VENDOR" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 2799.99,
    "stock_quantity": 45
  }'
```

### Deletar Produto

```bash
curl -X DELETE http://localhost:3001/products/PRODUCT_ID \
  -H "Authorization: Bearer TOKEN_VENDOR"
```

## 🛒 Pedidos

### Criar Pedido

```bash
curl -X POST http://localhost:3001/orders \
  -H "Authorization: Bearer TOKEN_CUSTOMER" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product_id": "uuid-produto-1",
        "quantity": 2
      },
      {
        "product_id": "uuid-produto-2",
        "quantity": 1
      }
    ],
    "shipping_name": "João Silva",
    "shipping_email": "joao@example.com",
    "shipping_phone": "+55 11 98765-4321",
    "shipping_address_line1": "Rua das Flores, 123",
    "shipping_address_line2": "Apt 45",
    "shipping_city": "São Paulo",
    "shipping_state": "SP",
    "shipping_zip": "01234-567",
    "shipping_country": "Brazil",
    "shipping_cost": 15.00,
    "tax": 10.00,
    "payment_method": "credit_card"
  }'
```

### Listar Pedidos

```bash
# Meus pedidos (customer)
curl http://localhost:3001/orders \
  -H "Authorization: Bearer TOKEN_CUSTOMER"

# Todos os pedidos (admin)
curl http://localhost:3001/orders \
  -H "Authorization: Bearer TOKEN_ADMIN"

# Filtrar por status
curl http://localhost:3001/orders?status=pending \
  -H "Authorization: Bearer TOKEN"
```

### Detalhes do Pedido

```bash
curl http://localhost:3001/orders/ORDER_ID \
  -H "Authorization: Bearer TOKEN"
```

### Atualizar Status do Pedido (Vendor/Admin)

```bash
curl -X PUT http://localhost:3001/orders/ORDER_ID/status \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped"
  }'
```

**Status válidos:**
- `pending` - Pendente
- `processing` - Processando
- `shipped` - Enviado
- `delivered` - Entregue
- `cancelled` - Cancelado
- `refunded` - Reembolsado

## 📱 Dispositivos (Push Notifications)

### Registrar Token FCM

```bash
curl -X POST http://localhost:3001/devices/register \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "fcm-token-aqui",
    "device_type": "web",
    "device_name": "Chrome on Windows"
  }'
```

### Listar Dispositivos

```bash
curl http://localhost:3001/devices \
  -H "Authorization: Bearer TOKEN"
```

### Desativar Dispositivo

```bash
curl -X DELETE http://localhost:3001/devices/FCM_TOKEN \
  -H "Authorization: Bearer TOKEN"
```

## 🔔 Notificações

### Enviar para Usuário Específico (Admin/Vendor)

```bash
curl -X POST http://localhost:3001/notifications/send \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-usuario",
    "title": "Promoção Especial!",
    "body": "50% de desconto em produtos selecionados",
    "data": {
      "action": "view_products",
      "category": "electronics"
    }
  }'
```

### Broadcast para Múltiplos Usuários (Admin)

```bash
curl -X POST http://localhost:3001/notifications/broadcast \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_ids": ["uuid-1", "uuid-2", "uuid-3"],
    "title": "Atualização do Sistema",
    "body": "Novos recursos disponíveis agora!",
    "data": {
      "type": "system_update"
    }
  }'
```

### Listar Minhas Notificações

```bash
curl http://localhost:3001/notifications \
  -H "Authorization: Bearer TOKEN"
```

### Marcar Notificação como Lida

```bash
curl -X PUT http://localhost:3001/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer TOKEN"
```

### Marcar Todas como Lidas

```bash
curl -X PUT http://localhost:3001/notifications/read-all \
  -H "Authorization: Bearer TOKEN"
```

## 📊 Fluxo Completo de Exemplo

### 1. Criar Conta de Vendedor

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendedor@loja.com",
    "password": "Vendedor@123",
    "name": "Maria Vendedora",
    "role": "vendor"
  }' | jq '.access_token' > vendor_token.txt

VENDOR_TOKEN=$(cat vendor_token.txt | tr -d '"')
```

### 2. Criar Produtos

```bash
curl -X POST http://localhost:3001/products \
  -H "Authorization: Bearer $VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mouse Gamer RGB",
    "description": "Mouse gamer com iluminação RGB personalizável",
    "price": 149.90,
    "compare_at_price": 199.90,
    "cost": 70.00,
    "stock_quantity": 100,
    "category": "Gaming"
  }' | jq '.id' > product_id.txt

PRODUCT_ID=$(cat product_id.txt | tr -d '"')
```

### 3. Cliente Faz Pedido

```bash
# Cliente cria conta
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@email.com",
    "password": "Cliente@123",
    "name": "Carlos Cliente"
  }' | jq '.access_token' > customer_token.txt

CUSTOMER_TOKEN=$(cat customer_token.txt | tr -d '"')

# Cliente cria pedido
curl -X POST http://localhost:3001/orders \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"items\": [{
      \"product_id\": \"$PRODUCT_ID\",
      \"quantity\": 1
    }],
    \"shipping_name\": \"Carlos Cliente\",
    \"shipping_email\": \"cliente@email.com\",
    \"shipping_phone\": \"+55 11 91234-5678\",
    \"shipping_address_line1\": \"Rua A, 100\",
    \"shipping_city\": \"São Paulo\",
    \"shipping_state\": \"SP\",
    \"shipping_zip\": \"01000-000\"
  }"
```

## 🔑 Variáveis de Ambiente para Scripts

```bash
# Salve em .env.test
export API_URL="http://localhost:3001"
export ADMIN_EMAIL="admin@dropship.com"
export ADMIN_PASSWORD="Admin@123"

# Use assim:
source .env.test
curl $API_URL/products
```

## 🧪 Postman Collection

Importe esta collection no Postman:

```json
{
  "info": {
    "name": "DropShip API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"admin@dropship.com\",\"password\":\"Admin@123\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001"
    }
  ]
}
```

---

**Mais exemplos na [Swagger Docs](http://localhost:3001/api/docs)**