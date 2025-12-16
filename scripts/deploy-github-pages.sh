#!/bin/bash

# Script de Deploy para GitHub Pages
# Execute este script para fazer deploy manual do projeto

set -e

echo "🚀 Iniciando deploy para GitHub Pages..."

# Verificar se está no branch correto
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  Aviso: Você não está no branch main/master (branch atual: $CURRENT_BRANCH)"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deploy cancelado"
        exit 1
    fi
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Há mudanças não commitadas no repositório"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deploy cancelado"
        exit 1
    fi
fi

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install

# Fazer build do projeto
echo "🔨 Fazendo build do projeto..."
pnpm run build:client

# Verificar se o diretório de build existe
if [ ! -d "dist/public" ]; then
    echo "❌ Erro: Diretório dist/public não encontrado após o build"
    exit 1
fi

# Deploy para gh-pages branch
echo "📡 Fazendo deploy para GitHub Pages..."

# Instalar gh-pages se não estiver instalado
if ! command -v gh-pages &> /dev/null; then
    echo "📦 Instalando gh-pages..."
    npm install -g gh-pages
fi

# Fazer deploy
gh-pages -d dist/public -m "Deploy: $(date)"

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Seu site estará disponível em: https://{seu-usuario}.github.io/{nome-do-repositorio}"
echo ""
echo "💡 Dica: Pode levar alguns minutos para as mudanças aparecerem online"