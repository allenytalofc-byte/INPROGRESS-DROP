# 🔥 Guia de Configuração do Firebase

Este guia explica como configurar o Firebase Cloud Messaging para notificações push.

## 📋 Pré-requisitos

- Conta Google
- Projeto criado no Firebase Console

## 🚀 Passo a Passo

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nomeie seu projeto (ex: "dropship-platform")
4. Desative o Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Adicionar Aplicativo Web

1. No overview do projeto, clique no ícone Web (`</>`)
2. Registre o app com um apelido (ex: "Store Frontend")
3. **NÃO** marque Firebase Hosting
4. Clique em "Registrar app"
5. **Copie as configurações** que aparecem

Exemplo:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "dropship-platform.firebaseapp.com",
  projectId: "dropship-platform",
  storageBucket: "dropship-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 3. Ativar Cloud Messaging

1. No menu lateral, vá em "Messaging" ou "Cloud Messaging"
2. Se necessário, ative o serviço
3. Clique na aba "Web configuration"

### 4. Gerar Chave VAPID

1. No Cloud Messaging, vá para "Web Push certificates"
2. Clique em "Generate key pair"
3. **Copie a chave VAPID** gerada

### 5. Obter Credenciais do Servidor

1. Clique no ícone de engrenagem ⚙️ > "Configurações do projeto"
2. Vá para a aba "Contas de serviço"
3. Clique em "Gerar nova chave privada"
4. Confirme e **baixe o arquivo JSON**

O arquivo terá este formato:
```json
{
  "type": "service_account",
  "project_id": "dropship-platform",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk-xxxxx@dropship-platform.iam.gserviceaccount.com",
  ...
}
```

### 6. Configurar Variáveis de Ambiente

#### Backend (.env)

```env
# Firebase Admin SDK (para enviar notificações)
FIREBASE_PROJECT_ID=dropship-platform
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@dropship-platform.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqh...\n-----END PRIVATE KEY-----\n"
```

**⚠️ Importante**: A `FIREBASE_PRIVATE_KEY` deve estar entre aspas e manter os `\n`.

#### Store Frontend (.env.local)

```env
# Firebase Client SDK (para receber notificações)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dropship-platform.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dropship-platform
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dropship-platform.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BNxxxxxxxxxxxxxxxYYYYYYYYYYYYYYYY
```

### 7. Atualizar Service Worker

Edite `apps/store-frontend/public/firebase-messaging-sw.js`:

```javascript
firebase.initializeApp({
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "dropship-platform.firebaseapp.com",
  projectId: "dropship-platform",
  storageBucket: "dropship-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
});
```

## 🧪 Testar Notificações

### 1. Reinicie os Serviços

```bash
# Reinicie a API para carregar novas variáveis
docker-compose restart api

# Ou se estiver rodando localmente:
cd services/api
npm run dev
```

### 2. Teste no Store

1. Acesse http://localhost:3000
2. Faça login ou crie uma conta
3. Quando solicitado, **permita notificações**
4. Verifique no console do navegador: "✅ Device token registered"

### 3. Envie Notificação Teste

#### Opção A: Pelo Admin Panel

1. Acesse http://localhost:3002
2. Login como admin
3. Vá para "Notificações"
4. No perfil, copie seu User ID
5. Cole no campo "IDs dos Usuários"
6. Preencha título e mensagem
7. Clique em "Enviar Notificações"

#### Opção B: Via API

```bash
# 1. Faça login e obtenha o token
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@dropship.com","password":"Customer@123"}'

# 2. Copie o access_token e user.id

# 3. Envie notificação (como admin)
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dropship.com","password":"Admin@123"}'

# 4. Com o token de admin, envie:
curl -X POST http://localhost:3001/notifications/send \
  -H "Authorization: Bearer TOKEN_ADMIN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_ID_DO_CUSTOMER",
    "title": "Teste de Notificação",
    "body": "Esta é uma notificação de teste!"
  }'
```

#### Opção C: Console do Firebase

1. No Firebase Console, vá para "Cloud Messaging"
2. Clique em "Enviar primeira mensagem"
3. Preencha título e texto
4. Clique em "Enviar mensagem de teste"
5. Cole o FCM token do console do navegador
6. Clique em "Testar"

## 🔍 Debug

### Verificar se Firebase Inicializou

No console do navegador (Store):
```javascript
// Deve aparecer:
✅ Firebase Admin SDK initialized successfully (backend)
✅ Device token registered (frontend)
```

### Logs do Backend

```bash
docker-compose logs -f api | grep -i firebase
```

### Verificar Token FCM

No Store, abra o console do navegador:
```javascript
localStorage.getItem('fcmToken')
```

### Problemas Comuns

#### "Firebase not initialized"
- Verifique se todas as variáveis estão no `.env`
- Reinicie a API

#### "Permission denied"
- Usuário não permitiu notificações
- Limpe o site settings no navegador e tente novamente

#### "Invalid registration token"
- Token FCM expirou
- Limpe localStorage e faça login novamente

#### "Messaging not supported"
- Use HTTPS em produção
- Use localhost em desenvolvimento
- Não funciona em modo privado/anônimo

## 🚀 Produção

### Requisitos

- **HTTPS obrigatório** (exceto localhost)
- Service Worker registrado
- Certificados SSL válidos

### Checklist

- [ ] Todas as variáveis configuradas
- [ ] Service Worker atualizado com config correta
- [ ] HTTPS ativo
- [ ] Domínio adicionado aos domínios autorizados do Firebase
- [ ] Testado em diferentes navegadores

## 📚 Recursos

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications)
- [Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)

---

**Dica**: Mantenha as credenciais do Firebase seguras e **nunca** commite no Git!