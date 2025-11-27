# Add RTL support to Arabic build
$arIndexPath = "dist/frontend/browser/ar/index.html"

if (Test-Path $arIndexPath) {
    $content = Get-Content $arIndexPath -Raw
    $content = $content -replace '<html lang="ar">', '<html lang="ar" dir="rtl">'
    Set-Content $arIndexPath $content
    Write-Host "✅ Added RTL support to Arabic build"
}
else {
    Write-Host "⚠️  Arabic build not found at $arIndexPath"
    Write-Host "    Run 'ng build --localize' first."
}
