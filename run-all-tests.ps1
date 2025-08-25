param(
    [switch]$Jest,
    [switch]$Playwright, 
    [switch]$Newman,
    [switch]$Coverage,
    [switch]$Visual
)

if (-not ($Jest -or $Playwright -or $Newman -or $Visual)) {
    # Si no se especifican flags, ejecutar todo
    $Jest = $Playwright = $Newman = $true
}

if ($Jest) {
    Write-Host "=== Ejecutando pruebas Jest (Frontend + API) ===" -ForegroundColor Green
    if ($Coverage) {
        npx jest tests/frontend tests/api --coverage
    } else {
        npx jest tests/frontend tests/api
    }
}

if ($Playwright) {
    Write-Host "`n=== Ejecutando pruebas E2E (Playwright) ===" -ForegroundColor Green  
    npx playwright test tests/e2e
}

if ($Visual) {
    Write-Host "`n=== Ejecutando pruebas Visual (Playwright) ===" -ForegroundColor Green
    npx playwright test tests/visual
}

if ($Newman) {
    Write-Host "`n=== Ejecutando pruebas Newman (Postman) ===" -ForegroundColor Green
    node tests\postman\newman.run.js
}

Write-Host "`n=== Pruebas completadas ===" -ForegroundColor Green
