# Aplicar a interface 0.15 no repositório existente

Extraia SpaceInvaders-Atualizacao-0.15.zip dentro da pasta do seu repositório SpaceInvaders, substituindo os arquivos correspondentes. Ele contém apenas diferenças em relação à base 0.14, preservando a pasta .git, dependências e builds locais. Não use o ZIP de atualização sozinho como instalação completa.

Na pasta do repositório:

    git add .
    git commit -m "Nova interface de campanha e dificuldade 0.15"
    git push

O workflow Pages já configurado publicará a pasta web. Para criar outro pacote Windows, execute o workflow Gerar aplicativo Windows ou npm run build:windows após npm ci e instalação do runtime Electron, conforme README.

O novo servidor inclui o tipo correto para arquivos CSS. Se usar um servidor antigo de desktop junto de arquivos web novos, atualize também server/http.cjs. A instalação completa Windows 0.15 já contém essa correção.
