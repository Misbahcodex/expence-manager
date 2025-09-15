# PowerShell script to run all security checks

Write-Host "
==============================================" -ForegroundColor Cyan
Write-Host "Running all security checks..." -ForegroundColor Cyan
Write-Host "==============================================
" -ForegroundColor Cyan

# Run security scan
Write-Host "
[1/4] Running security scan..." -ForegroundColor Yellow
npm run security:scan

# Check environment variables
Write-Host "
[2/4] Checking environment variables..." -ForegroundColor Yellow
npm run security:check-env

# Test secure email implementation
Write-Host "
[3/4] Testing secure email implementation..." -ForegroundColor Yellow
Push-Location -Path "$PSScriptRoot\backend"
try {
    npm run test:email
} finally {
    Pop-Location
}

# Run linting
Write-Host "
[4/4] Running linting..." -ForegroundColor Yellow
npm run lint

Write-Host "
==============================================" -ForegroundColor Green
Write-Host "Security checks completed!" -ForegroundColor Green
Write-Host "==============================================
" -ForegroundColor Green