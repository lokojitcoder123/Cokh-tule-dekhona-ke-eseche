@echo off
title Push to GitHub
echo ==========================================
echo       PUSHING PROJECT TO GITHUB
echo ==========================================
echo.

:: Ensure we are in the script's directory
cd /d "%~dp0"

:: 1. Reset local Git history to remove any old secrets
echo [1/5] Resetting Git history...
if exist .git (
    rmdir /s /q .git
)
git init
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to initialize Git. Make sure Git is installed.
    goto error
)

:: 2. Stage files
echo [2/5] Staging files...
git add .
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to stage files.
    goto error
)

:: 3. Commit
echo [3/5] Committing changes...
git commit -m "Initial commit - Bengali Shadi matrimony app"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Commit failed.
    goto error
)

:: 4. Add remote origin
echo [4/5] Adding remote origin...
git remote add origin https://github.com/lokojitcoder123/Cokh-tule-dekhona-ke-eseche.git
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to add remote origin.
    goto error
)

:: 5. Try pushing to main first
echo [5/5] Pushing to main branch...
git branch -M main
git push -u origin main --force

if %ERRORLEVEL% equ 0 goto success

:: If main failed, automatically try setup branch
echo.
echo [INFO] Push to main was rejected (branch protection rules).
echo [INFO] Pushing to 'setup' branch instead...
git checkout -b setup
git push -u origin setup --force

if %ERRORLEVEL% equ 0 goto success_setup

goto error

:success
echo.
echo ==========================================
echo  SUCCESS! Project pushed to main branch!
echo  https://github.com/lokojitcoder123/Cokh-tule-dekhona-ke-eseche
echo ==========================================
pause
exit

:success_setup
echo.
echo ==========================================
echo  SUCCESS! Project pushed to 'setup' branch!
echo.
echo  Next step: Go to GitHub and create a Pull Request
echo  to merge 'setup' into 'main':
echo  https://github.com/lokojitcoder123/Cokh-tule-dekhona-ke-eseche
echo ==========================================
pause
exit

:error
echo.
echo ==========================================
echo  FAILED to push to GitHub.
echo  Please check the error messages above.
echo ==========================================
pause
