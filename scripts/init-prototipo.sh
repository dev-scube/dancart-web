#!/bin/bash

# Script de inicialização do protótipo
# Execute este script para configurar e iniciar o projeto

set -e

echo "🚀 Inicializando Protótipo DançArt..."

# Verificar se o banco tem dados
if [ ! -f ".data/sqlite.db" ]; then
    echo "📦 Banco de dados não encontrado. Criando e populando..."
    pnpm run db:push
    pnpm run db:seed
else
    echo "✅ Banco de dados já existe"
    
    # Perguntar se quer resetar os dados
    read -p "🔄 Deseja resetar os dados mockados? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Resetando dados mockados..."
        pnpm run db:seed
    fi
fi

echo ""
echo "🌟 Protótipo pronto!"
echo ""
echo "📋 Informações importantes:"
echo "   • Servidor: http://localhost:3000"
echo "   • Admin: http://localhost:3000/dev-login"
echo "   • Docs: PROTOTIPO-FUNCIONANDO.md"
echo ""
echo "🎯 Para acessar como admin:"
echo "   1. Vá para /dev-login"
echo "   2. Clique em 'Entrar como Admin'"
echo "   3. Acesse o dashboard em /admin"
echo ""

# Iniciar servidor de desenvolvimento
echo "🏃‍♂️ Iniciando servidor de desenvolvimento..."
pnpm run dev