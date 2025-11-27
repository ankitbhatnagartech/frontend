@echo off
echo.
echo 🌍 Serving localized builds...
echo.
echo Available languages:
echo   English:  http://localhost:4200/en/
echo   French:   http://localhost:4200/fr/
echo   German:   http://localhost:4200/de/
echo   Spanish:  http://localhost:4200/es/
echo   Chinese:  http://localhost:4200/zh/
echo   Japanese: http://localhost:4200/ja/
echo   Hindi:    http://localhost:4200/hi/
echo   Arabic:   http://localhost:4200/ar/
echo.
echo Press Ctrl+C to stop the server
echo.

npx http-server dist/frontend/browser -p 4200 -o /en/
