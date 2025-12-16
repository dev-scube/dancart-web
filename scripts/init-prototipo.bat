@echo off
REM Script de inicialização do protótipo (Windows)
REM Execute este script para configurar e iniciar o projeto

echo 🚀 Inicializando Protótipo DançArt...

REM Verificar se o banco tem dados
if not exist ".data\sqlite.db" (
    echo 📦 Banco de dados não encontrado. Criando e populando...
    pnpm run db:push
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erro ao criar banco de dados
        pause
        exit /b 1
    )
    pnpm run db:seed
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erro ao popular banco de dados
        pause
        exit /b 1
    )
) else (
    echo ✅ Banco de dados já existe
    
    set /p "reset=🔄 Deseja resetar os dados mockados? (y/N): "
    if /i "%reset%"=="y" (
        echo 🔄 Resetando dados mockados...
        pnpm run db:seed
    )
)

echo.
echo 🌟 Protótipo pronto!
echo.
echo 📋 Informações importantes:
echo    • Servidor: http://localhost:3000
echo    • Admin: http://localhost:3000/dev-login  
echo    • Docs: PROTOTIPO-FUNCIONANDO.md
echo.
echo 🎯 Para acessar como admin:
echo    1. Vá para /dev-login
echo    2. Clique em 'Entrar como Admin'
echo    3. Acesse o dashboard em /admin
echo.

REM Iniciar servidor de desenvolvimento
echo 🏃‍♂️ Iniciando servidor de desenvolvimento...
pnpm run dev