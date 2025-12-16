# DançArt - Espaço Cultural

Protótipo de site completo para o espaço cultural DançArt de Ouro Branco, MG.

## 📋 Funcionalidades Implementadas

### Site Público
- **Landing Page** com seções:
  - Hero com apresentação
  - Quem Somos
  - Nossa Missão
  - Agendamento de Aula Experimental
  - Depoimentos de Alunos
  - Contato e Localização

- **Galeria de Álbuns** com filtros por categoria (eventos, competições, viagens)
- **Página de Eventos** com inscrições online
- **Venda de Ingressos** para eventos
- **Página de Mensalidades** com informações de planos

### Portal do Aluno
- Dashboard personalizado
- Visualização de matrículas ativas
- Histórico de mensalidades
- Avisos e comunicados

### Módulo Administrativo
- **Dashboard de BI** com métricas e gráficos
- **Gestão de Bailarinos** com fichas cadastrais completas
- **Gestão de Cursos** com controle de vagas
- **Gestão de Matrículas** com sistema de bolsas (parcial/integral)
- **Controle de Mensalidades** com histórico de pagamentos
- **Gerenciamento de Agendamentos** de aulas experimentais
- **Moderação de Depoimentos**
- **Gestão de Eventos** com controle de inscrições

## 🎨 Identidade Visual

- **Cores**: Rosa/Magenta (#E91E63) e Roxo (#9C27B0)
- **Tipografia**: Poppins
- **Logo**: DançArt (incluída no projeto)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)

### Instalação

```bash
# Instalar dependências
pnpm install

# Configurar banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

O site estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
dancat-website/
├── client/              # Frontend React
│   ├── public/          # Arquivos estáticos (logo, imagens)
│   └── src/
│       ├── pages/       # Páginas do site
│       ├── components/  # Componentes reutilizáveis
│       └── index.css    # Estilos globais e tema
├── server/              # Backend Node.js
│   ├── routers.ts       # Rotas da API
│   ├── db.ts            # Funções de banco de dados
│   └── db-extended.ts   # Funções adicionais
├── drizzle/             # Schema do banco de dados
└── scripts/             # Scripts utilitários
```

## 🗄️ Banco de Dados

O projeto usa MySQL com Drizzle ORM. As tabelas incluem:

- `bailarinos` - Cadastro de alunos
- `cursos` - Modalidades de dança
- `matriculas` - Matrículas dos alunos
- `mensalidades` - Controle financeiro
- `agendamentos` - Aulas experimentais
- `depoimentos` - Avaliações de alunos
- `eventos` - Eventos e apresentações
- `inscricoesEventos` - Inscrições em eventos

## 📝 Dados de Demonstração

Para popular o banco com dados de exemplo, você pode:

1. Acessar o painel administrativo em `/admin`
2. Cadastrar manualmente bailarinos, cursos e matrículas
3. Ou executar o script de seed (em desenvolvimento)

## 🔐 Autenticação

O sistema possui autenticação integrada via OAuth. Para acessar:

- **Portal do Aluno**: Requer login de aluno/responsável
- **Painel Administrativo**: Requer login de administrador

## 🎯 Próximos Passos Sugeridos

1. **Integração com Gateway de Pagamento** (Stripe/PagSeguro)
2. **Sistema de Notificações por Email/SMS**
3. **Sistema de Presença com QR Code**
4. **Relatórios Exportáveis em PDF**
5. **Upload de Fotos para Galeria**

## 📞 Suporte

Para dúvidas ou sugestões sobre o protótipo, entre em contato.

---

**Desenvolvido para DançArt - Espaço Cultural de Dança em Ouro Branco, MG**
