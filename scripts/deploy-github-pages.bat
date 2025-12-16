@echo off
REM Script de Deploy para GitHub Pages (Windows)
REM Execute este script para fazer deploy manual do projeto

echo 🚀 Iniciando deploy para GitHub Pages...

REM Verificar se há mudanças não commitadas
git status --porcelain > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro: Não foi possível verificar o status do git
    pause
    exit /b 1
)

REM Instalar dependências
echo 📦 Instalando dependências...
pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

REM Fazer build do projeto
echo 🔨 Fazendo build do projeto...
pnpm run build:client
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro no build do projeto
    pause
    exit /b 1
)

REM Verificar se o diretório de build existe
if not exist "dist\public" (
    echo ❌ Erro: Diretório dist\public não encontrado após o build
    pause
    exit /b 1
)

REM Deploy para gh-pages branch
echo 📡 Fazendo deploy para GitHub Pages...

REM Verificar se gh-pages está instalado globalmente
where gh-pages > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Instalando gh-pages...
    npm install -g gh-pages
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erro ao instalar gh-pages
        pause
        exit /b 1
    )
)

REM Fazer deploy
gh-pages -d dist/public -m "Deploy: %date% %time%"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro no deploy
    pause
    exit /b 1
)

echo ✅ Deploy concluído com sucesso!
echo 🌐 Seu site estará disponível em: https://{seu-usuario}.github.io/{nome-do-repositorio}
echo.
echo 💡 Dica: Pode levar alguns minutos para as mudanças aparecerem online
pause