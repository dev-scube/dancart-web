# Configuração do GitHub Pages para o Projeto DanCat Website

## 📝 Instruções de Setup

### 1. Configuração do Repositório GitHub

1. **Faça push do projeto para o GitHub** (se ainda não fez):
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment setup"
   git push origin main
   ```

2. **Configure o GitHub Pages**:
   - Vá para as configurações do seu repositório no GitHub
   - Na seção "Pages" (lateral esquerda)
   - Em "Source", selecione "GitHub Actions"

3. **Ajuste a configuração base do Vite**:
   - No arquivo `vite.config.ts`, substitua `/dancat-website/` pelo nome real do seu repositório
   - Por exemplo, se seu repositório for `meu-usuario/meu-site`, use `/meu-site/`

### 2. Como fazer deploy

#### Opção 1: Deploy Automático (Recomendado)
O deploy automático acontece sempre que você fizer push para o branch `main`:
```bash
git add .
git commit -m "Suas alterações"
git push origin main
```

#### Opção 2: Deploy Manual
Execute o script de deploy:
```bash
# No Windows
pnpm run deploy:github-pages

# No Linux/Mac
pnpm run deploy:github-pages:unix
```

### 3. Estrutura criada

- **`.github/workflows/deploy-github-pages.yml`**: Workflow do GitHub Actions
- **`scripts/deploy-github-pages.sh`**: Script de deploy para Linux/Mac
- **`scripts/deploy-github-pages.bat`**: Script de deploy para Windows
- **Novos scripts no `package.json`**:
  - `build:client`: Constrói apenas o cliente
  - `build:server`: Constrói apenas o servidor
  - `deploy:github-pages`: Deploy manual (Windows)
  - `deploy:github-pages:unix`: Deploy manual (Linux/Mac)

### 4. URLs importantes

- **Seu site estará disponível em**: `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO`
- **Actions do GitHub**: `https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO/actions`

### 5. Solução de problemas

#### O site não carrega corretamente
- Verifique se o `base` no `vite.config.ts` está correto
- Deve ser o nome do seu repositório entre barras: `/nome-do-repositorio/`

#### Deploy falha no GitHub Actions
- Verifique se as GitHub Pages estão habilitadas no repositório
- Confirme que a source está configurada como "GitHub Actions"

#### Erro de permissões
- Vá para Settings > Actions > General
- Em "Workflow permissions", selecione "Read and write permissions"

### 6. Próximos passos

1. **Teste local antes de fazer deploy**:
   ```bash
   pnpm run build:client
   pnpm run dev
   ```

2. **Configure domínio personalizado** (opcional):
   - Adicione arquivo `CNAME` em `client/public/` com seu domínio

3. **Configure variáveis de ambiente** (se necessário):
   - No GitHub: Settings > Secrets and variables > Actions

### 7. Comandos úteis

```bash
# Desenvolvimento local
pnpm run dev

# Build apenas do cliente
pnpm run build:client

# Build completo (cliente + servidor)
pnpm run build

# Deploy manual
pnpm run deploy:github-pages
```