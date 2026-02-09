@echo off
setlocal

echo [SETUP] Checking for pnpm...
:: Try to run pnpm version to see if it's in PATH
call pnpm --version >nul 2>nul
if %errorlevel% equ 0 (
    echo [SETUP] Found global pnpm.
    set PNPM_CMD=pnpm
) else (
    echo [SETUP] pnpm not found in PATH or not installed.
    echo [SETUP] Falling back to 'npx pnpm'...
    set PNPM_CMD=npx pnpm
)

echo [SETUP] Using command: %PNPM_CMD%

echo [SETUP] Installing dependencies...
call %PNPM_CMD% install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    goto :error
)

echo [SETUP] Generating Prisma Client...
call %PNPM_CMD% db:generate
if %errorlevel% neq 0 (
    echo [ERROR] Failed to generate Prisma Client.
    goto :error
)

echo [SETUP] Building packages...
call %PNPM_CMD% build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build packages.
    goto :error
)

echo [SETUP] Setup complete! Run 'npm run dev' to start development.
pause
exit /b 0

:error
echo [ERROR] Setup failed!
pause
exit /b 1
