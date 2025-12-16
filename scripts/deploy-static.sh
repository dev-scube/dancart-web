#!/bin/bash

# Script para deploy do protótipo estático no GitHub Pages
# Este script faz build estático e deploy automaticamente

set -e

echo "🎨 Preparando protótipo estático para GitHub Pages..."

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Commitando mudanças para protótipo estático..."
    git add .
    git commit -m "Configure static prototype for GitHub Pages with mock data

    ✨ Features:
    - 100% static build with embedded mock data
    - Authentication via /dev-login (no external dependencies)
    - Complete admin dashboard with mock APIs
    - SPA routing compatible with GitHub Pages
    - Responsive design for all devices
    
    🎯 Demo ready:
    - Public pages showcase studio and classes
    - Admin demo accessible via dev-login
    - All CRUD operations work with local state
    - No backend or database dependencies"
fi

# Fazer build estático
echo "🔨 Fazendo build estático..."
pnpm run build:static

if [ ! -d "dist/public" ]; then
    echo "❌ Erro: Build falhou - diretório dist/public não encontrado"
    exit 1
fi

# Fazer push das mudanças
echo "📡 Enviando para GitHub..."
git push origin main

echo ""
echo "✅ Deploy do protótipo estático concluído!"
echo ""
echo "🌟 Seu protótipo estará disponível em:"
echo "   https://dev-scube.github.io/dancart-web/"
echo ""
echo "🎯 Funcionalidades disponíveis:"
echo "   • Páginas públicas com design completo"
echo "   • Dados mockados realísticos integrados"
echo "   • Login de demonstração em /dev-login"
echo "   • Dashboard administrativo funcional"
echo "   • Interface responsiva para todos os dispositivos"
echo ""
echo "🔧 Para acessar como admin no protótipo:"
echo "   1. Vá para: https://dev-scube.github.io/dancart-web/dev-login"
echo "   2. Clique em 'Entrar como Admin'"
echo "   3. Explore o dashboard completo!"
echo ""
echo "💡 O protótipo funciona 100% no frontend sem backend!"