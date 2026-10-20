@echo off
REM Doble clic para abrir el portal en el navegador
start "" http://localhost:8080
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0iniciar-servidor.ps1"
