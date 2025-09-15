# PowerShell script to run email test

Write-Host "Running email test..."
Set-Location -Path "$PSScriptRoot\backend"
npm run test:email