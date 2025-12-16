@echo off
REM Script para deploy do protótipo estático no GitHub Pages (Windows)

echo 🎨 Preparando protótipo estático para GitHub Pages...

REM Verificar se há mudanças não commitadas
git status --porcelain > nul 2>&1
for /f %%i in ('git status --porcelain') do set HAS_CHANGES=1

if defined HAS_CHANGES (
    echo 📝 Commitando mudanças para protótipo estático...
    git add .
    git commit -m "Configure static prototype for GitHub Pages with mock data - ✨ Features: 100%% static build with embedded mock data, Authentication via /dev-login, Complete admin dashboard with mock APIs, SPA routing compatible with GitHub Pages - 🎯 Demo ready: All pages showcase studio, Admin demo accessible, CRUD operations work, No backend dependencies"
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erro ao fazer commit
        pause
        exit /b 1
    )
)

REM Fazer build estático
echo 🔨 Fazendo build estático...
pnpm run build:static
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro no build
    pause
    exit /b 1
)

if not exist "dist\public" (
    echo ❌ Erro: Build falhou - diretório dist\public não encontrado
    pause
    exit /b 1
)

REM Fazer push das mudanças
echo 📡 Enviando para GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao fazer push
    pause
    exit /b 1
)

echo.
echo ✅ Deploy do protótipo estático concluído!
echo.
echo 🌟 Seu protótipo estará disponível em:
echo    https://dev-scube.github.io/dancart-web/
echo.
echo 🎯 Funcionalidades disponíveis:
echo    • Páginas públicas com design completo
echo    • Dados mockados realísticos integrados  
echo    • Login de demonstração em /dev-login
echo    • Dashboard administrativo funcional
echo    • Interface responsiva para todos os dispositivos
echo.
echo 🔧 Para acessar como admin no protótipo:
echo    1. Vá para: https://dev-scube.github.io/dancart-web/dev-login
echo    2. Clique em 'Entrar como Admin'
echo    3. Explore o dashboard completo!
echo.
echo 💡 O protótipo funciona 100%% no frontend sem backend!
pause