# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o projeto DropShip Platform!

## 📋 Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade

## 🚀 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USUARIO/dropshipping-monorepo.git
cd dropshipping-monorepo

# Adicione o repositório original como upstream
git remote add upstream https://github.com/ORIGINAL/dropshipping-monorepo.git
```

### 2. Crie uma Branch

```bash
# Atualize seu main
git checkout main
git pull upstream main

# Crie uma branch para sua feature
git checkout -b feature/minha-feature

# Ou para bugfix
git checkout -b fix/meu-bugfix
```

### 3. Faça suas Mudanças

- Escreva código limpo e bem documentado
- Siga os padrões do projeto
- Adicione testes se aplicável
- Atualize a documentação

### 4. Commit

Use mensagens descritivas:

```bash
git add .
git commit -m "feat: adiciona funcionalidade X"

# Tipos de commit:
# feat: nova funcionalidade
# fix: correção de bug
# docs: documentação
# style: formatação
# refactor: refatoração
# test: testes
# chore: tarefas gerais
```

### 5. Push e Pull Request

```bash
git push origin feature/minha-feature
```

Então abra um Pull Request no GitHub.

## 🎨 Padrões de Código

### TypeScript/JavaScript

```typescript
// Use tipos explícitos
function calculateTotal(price: number, quantity: number): number {
  return price * quantity
}

// Use nomes descritivos
const isUserAuthenticated = true // ✅
const flag = true // ❌
```

### React/Next.js

```tsx
// Use componentes funcionais
export default function ProductCard({ product }: Props) {
  // Hooks no topo
  const [loading, setLoading] = useState(false)
  
  // Handlers
  const handleClick = () => {
    // ...
  }
  
  // Render
  return (
    <div className="...">
      {/* ... */}
    </div>
  )
}
```

### NestJS

```typescript
// Use decoradores apropriados
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  
  @Get()
  @ApiOperation({ summary: 'List all products' })
  async findAll() {
    return this.productsService.findAll()
  }
}
```

## 📝 Documentação

- Comente código complexo
- Atualize o README se necessário
- Adicione exemplos de uso
- Documente APIs com Swagger

## ✅ Checklist antes do PR

- [ ] Código testado localmente
- [ ] Sem erros de lint
- [ ] Documentação atualizada
- [ ] Mensagens de commit claras
- [ ] Branch atualizada com main

## 🐛 Reportando Bugs

Use o template de issue:

```markdown
**Descrição do Bug**
Descrição clara do problema

**Como Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Role até '....'
4. Veja o erro

**Comportamento Esperado**
O que deveria acontecer

**Screenshots**
Se aplicável

**Ambiente**
- OS: [e.g. Ubuntu 22.04]
- Node: [e.g. 18.17.0]
- Browser: [e.g. Chrome 120]
```

## 💡 Sugerindo Features

- Explique o problema que resolve
- Descreva a solução proposta
- Considere alternativas
- Mostre exemplos

## 🧪 Testes

```bash
# Rodar testes (quando implementados)
npm test

# Testes específicos
npm test -- ProductsService
```

## 📦 Estrutura de Arquivos

Mantenha a organização:

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas Next.js
├── lib/           # Utilitários
├── contexts/      # React Contexts
└── types/         # TypeScript types
```

## 🎯 Áreas que Precisam de Ajuda

- [ ] Testes automatizados
- [ ] Tradução (i18n)
- [ ] Melhorias de acessibilidade
- [ ] Otimizações de performance
- [ ] Documentação

## 📮 Contato

Dúvidas? Abra uma issue ou discussion no GitHub.

---

**Obrigado por contribuir! 🎉**