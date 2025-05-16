@echo off
echo Exécution du script auto-commit...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0auto-commit.ps1"
pause 