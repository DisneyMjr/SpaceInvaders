$ErrorActionPreference = 'Stop'
$source = $PSScriptRoot
node (Join-Path $source 'scripts/validate-web.cjs')
if ($LASTEXITCODE -ne 0) { throw 'A versão está incompleta. Extraia o pacote GitHub inteiro antes de publicar.' }
$destination = Join-Path (Split-Path $source -Parent) ('SpaceInvaders-publicar-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
git clone https://github.com/DisneyMjr/SpaceInvaders.git $destination
if ($LASTEXITCODE -ne 0) { throw 'Não foi possível baixar o repositório.' }
robocopy $source $destination /E /XD node_modules dist .git /XF preview-* *-qa.json
if ($LASTEXITCODE -ge 8) { throw 'A cópia dos arquivos falhou.' }
Push-Location $destination
try {
    node scripts/validate-web.cjs
    if ($LASTEXITCODE -ne 0) { throw 'Verificação da cópia falhou. Nada foi enviado.' }
    git add .
    if ($LASTEXITCODE -ne 0) { throw 'Não foi possível preparar os arquivos.' }
    git add -f web scripts/validate-web.cjs .github/workflows/pages.yml
    if ($LASTEXITCODE -ne 0) { throw 'Não foi possível incluir a distribuição completa.' }
    git commit -m 'Corrige pacote web completo e adiciona guia Chromecast e Google TV'
    if ($LASTEXITCODE -ne 0) { throw 'Não foi possível criar a atualização.' }
    git push origin HEAD
    if ($LASTEXITCODE -ne 0) { throw 'O GitHub não recebeu a atualização. Confira a autenticação.' }
    Write-Host 'Atualização enviada. Aguarde a ação Publicar versão web terminar no GitHub.'
} finally { Pop-Location }
