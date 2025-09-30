# 🧪 Guia de Testes - Dropshipping Platform

Este guia fornece instruções detalhadas para testar todas as funcionalidades da plataforma.

## 🚀 Setup Inicial

### 1. Executar Setup Automatizado
```bash
# Torne o script executável (se necessário)
chmod +x setup.sh

# Execute o setup completo
./setup.sh
```

### 2. Setup Manual (alternativo)
```bash
# 1. Instalar dependências
npm run install:all

# 2. Configurar ambiente
cp .env.example .env
# Edite .env com suas configurações

# 3. Iniciar containers
npm run docker:up

# 4. Aguardar banco estar pronto
sleep 30

# 5. Executar migrations
npm run migrate

# 6. Criar dados iniciais
npm run seed

# 7. Iniciar desenvolvimento
npm run dev
```

## 🔐 Contas de Teste

Após executar `npm run seed`:

| Tipo | Email | Senha | Acesso |
|------|-------|-------|--------|
| **Admin** | admin@dropshipping.com | admin123 | Painel completo |
| **Fornecedor** | supplier@dropshipping.com | supplier123 | Gestão de produtos |

## 📱 Testando Store Frontend (http://localhost:3000)

### ✅ Registro de Usuário
1. Acesse http://localhost:3000
2. Clique em "Sign Up"
3. Preencha o formulário de registro
4. Verifique se o login é feito automaticamente
5. **Teste de acessibilidade**: Navegue usando apenas o teclado (Tab, Enter, Esc)

### ✅ Login de Usuário
1. Clique em "Sign In"
2. Use as credenciais de teste ou crie uma nova conta
3. Verifique se o perfil é carregado corretamente

### ✅ Tema Dark/Light
1. Clique no ícone de sol/lua no header
2. Verifique se o tema muda instantaneamente
3. Recarregue a página e verifique se o tema persiste

### ✅ Busca de Produtos
1. Use a barra de busca no header
2. Digite termos como "headphones", "shirt", "garden"
3. Verifique se os resultados são filtrados corretamente
4. Teste os filtros na página de busca (categoria, preço, ordenação)

### ✅ Responsividade
1. Redimensione a janela do navegador
2. Teste em diferentes tamanhos de tela
3. Verifique se o menu mobile funciona corretamente

### ✅ Notificações Push
1. Faça login no store frontend
2. Permita notificações quando solicitado
3. Vá para o admin panel e envie uma notificação
4. Verifique se a notificação aparece no frontend

## 🎛️ Testando Admin Panel (http://localhost:3001)

### ✅ Login Admin
1. Acesse http://localhost:3001
2. Use admin@dropshipping.com / admin123
3. Verifique se o dashboard carrega com métricas

### ✅ Dashboard
1. Verifique se as estatísticas são exibidas
2. Confirme se os gráficos estão funcionando
3. Teste a responsividade do dashboard

### ✅ Gerenciamento de Produtos
1. Vá para "Products" no menu lateral
2. Clique em "Add Product"
3. Preencha o formulário de produto
4. Teste edição e exclusão de produtos
5. Verifique se a busca funciona

### ✅ Sistema de Notificações
1. Vá para "Notifications"
2. Clique em "Send Notification"
3. Preencha título, mensagem e selecione audiência
4. Envie a notificação
5. Verifique se aparece na lista de notificações enviadas

### ✅ Gestão de Pedidos
1. Vá para "Orders"
2. Verifique se os pedidos são listados
3. Teste mudança de status de pedidos

## 🔧 Testando Backend API (http://localhost:3002/api/docs)

### ✅ Documentação Swagger
1. Acesse http://localhost:3002/api/docs
2. Explore os endpoints disponíveis
3. Teste autenticação usando "Authorize"

### ✅ Autenticação
1. Use o endpoint POST /auth/login
2. Teste com as credenciais de admin
3. Copie o token retornado
4. Use o token em endpoints protegidos

### ✅ CRUD de Produtos
1. GET /products - Listar produtos
2. POST /products - Criar produto (requer autenticação)
3. PUT /products/:id - Atualizar produto
4. DELETE /products/:id - Excluir produto

### ✅ Sistema de Notificações
1. POST /notifications/register-device - Registrar dispositivo
2. POST /notifications/send - Enviar notificação (admin only)
3. GET /notifications - Listar notificações

## ⚙️ Testando Workers

### ✅ Importação CSV
```bash
# Navegue para o diretório workers
cd services/workers

# Execute importação de exemplo
node src/import-csv.js sample-products.csv 2

# Verifique se os produtos foram importados no banco
```

### ✅ Workers em Background
1. Verifique os logs dos workers no Docker
2. Confirme se as tarefas agendadas estão executando
3. Monitore processamento de pedidos e alertas de estoque

## 🐛 Testando Cenários de Erro

### ✅ Validação de Dados
1. Tente registrar usuário com email inválido
2. Tente criar produto sem campos obrigatórios
3. Verifique se as mensagens de erro são exibidas

### ✅ Autenticação
1. Tente acessar endpoint protegido sem token
2. Use token expirado
3. Verifique se retorna erro 401

### ✅ Permissões
1. Login como supplier e tente acessar funcionalidades de admin
2. Verifique se o acesso é negado adequadamente

## 📊 Testando Performance

### ✅ Tempo de Resposta
1. Use DevTools para medir tempo de carregamento
2. Teste com diferentes tamanhos de dados
3. Verifique se há vazamentos de memória

### ✅ Concorrência
1. Abra múltiplas abas
2. Execute operações simultâneas
3. Verifique se não há conflitos

## 🔍 Testando Acessibilidade

### ✅ Navegação por Teclado
1. Use apenas Tab, Enter, Esc para navegar
2. Verifique se todos os elementos são focáveis
3. Confirme se a ordem de foco faz sentido

### ✅ Screen Reader
1. Use um screen reader (NVDA, JAWS, VoiceOver)
2. Verifique se o conteúdo é anunciado corretamente
3. Teste formulários e navegação

### ✅ Contraste
1. Verifique se há contraste adequado
2. Teste em modo de alto contraste
3. Confirme se textos são legíveis

## 📱 Testando PWA

### ✅ Service Worker
1. Abra DevTools > Application > Service Workers
2. Verifique se o service worker está registrado
3. Teste funcionamento offline

### ✅ Manifest
1. Verifique se o manifest.json está correto
2. Teste instalação como PWA
3. Confirme se os ícones aparecem

## 🚨 Checklist de Testes

### Frontend Store
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Tema dark/light funciona
- [ ] Busca de produtos funciona
- [ ] Filtros funcionam
- [ ] Responsividade está ok
- [ ] Acessibilidade está ok
- [ ] Notificações push funcionam

### Admin Panel
- [ ] Login admin funciona
- [ ] Dashboard carrega métricas
- [ ] CRUD de produtos funciona
- [ ] Sistema de notificações funciona
- [ ] Gestão de pedidos funciona
- [ ] Interface é responsiva

### Backend API
- [ ] Swagger UI funciona
- [ ] Autenticação JWT funciona
- [ ] CRUD endpoints funcionam
- [ ] Validação de dados funciona
- [ ] Rate limiting funciona

### Workers
- [ ] Importação CSV funciona
- [ ] Workers em background funcionam
- [ ] Tarefas agendadas executam

### Integração
- [ ] Frontend comunica com API
- [ ] Notificações push funcionam end-to-end
- [ ] Workers processam dados corretamente

## 🐛 Problemas Comuns e Soluções

### Erro de Conexão com Banco
```bash
# Verificar se container está rodando
docker ps

# Reiniciar containers
npm run docker:down && npm run docker:up
```

### Erro de Permissão Firebase
- Verificar credenciais no .env
- Confirmar se projeto Firebase está ativo
- Verificar se Cloud Messaging está habilitado

### Problemas de Build
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de Porta em Uso
```bash
# Verificar processos usando as portas
lsof -i :3000
lsof -i :3001
lsof -i :3002

# Matar processos se necessário
kill -9 <PID>
```

---

## 📞 Suporte

Se encontrar problemas durante os testes:

1. **Verifique os logs**: `npm run docker:logs`
2. **Consulte a documentação**: README.md
3. **Execute o setup novamente**: `./setup.sh`
4. **Abra uma issue** no repositório

**Boa sorte com os testes! 🚀**