# SpaceInvaders 0.17 — pacote web completo e TV

A publicação anterior continha index.html e game.js novos, mas faltavam command-shell.css, command-shell.mjs, menu-data.mjs, battle-hud.mjs e outros arquivos. Isso deixava o menu sem estilo e interrompia a execução. Esta distribuição contém todos os arquivos, incluindo as imagens do menu. Use o pacote completo desta versão, não somente o antigo patch 0.16.1.

## GitHub Pages

Extraia o pacote GitHub inteiro. Abra o PowerShell na pasta extraída e execute `& .\PUBLICAR-GITHUB.ps1`. O script confere a distribuição, cria uma nova cópia do repositório em uma pasta vizinha, copia os arquivos, valida novamente e envia o commit. Se o GitHub pedir, entre na sua conta. O script requer Git e Node.js. Também é possível copiar o conteúdo completo para sua cópia do repositório, executar `node scripts/validate-web.cjs`, depois `git add .`, `git commit` e `git push`.

A ação Publicar versão web agora verifica todos os arquivos, referências e hashes antes do envio ao Pages. Se um módulo, estilo ou imagem estiver faltando, a publicação falha com uma mensagem indicando o arquivo. Não altere arquivos web sem regenerar o manifesto usando `node scripts/validate-web.cjs --write` e revisar o resultado.

## cPanel e outras hospedagens web

Extraia o pacote Web completo na pasta pública do site, preservando todas as subpastas. Não é necessário Node.js para hospedar o site estático. O servidor multiplayer continua separado. Se uma versão antiga persistir no navegador, use Ctrl + Shift + R. Em caso de arquivo ausente, o jogo agora mostra o erro com ações para recarregar ou limpar o cache deste jogo.

## Chromecast / Google TV

O botão TRANSMITIR PARA TV aparece no menu, e TV no painel da partida. Ele abre instruções para espelhar a mesma partida e oferece tela cheia. Ele não descobre dispositivos nem abre sozinho o seletor do Chrome.

No computador com Google Chrome: menu ⋮ → Transmitir, salvar e compartilhar → Transmitir… → Fontes → Transmitir guia → sua TV. No Android: aplicativo Google Home → sua TV → Transmitir tela; depois volte ao jogo. Mantenha os aparelhos na mesma rede Wi-Fi. Encerre a transmissão no mesmo aplicativo. O controle continua no computador ou celular. O espelhamento pode adicionar atraso.

Referências oficiais: https://support.google.com/chrome/answer/3228332?hl=pt-BR e https://support.google.com/chromecast/answer/6059461?hl=pt-BR

## Validação

Menu, navegação, diálogo de dificuldade, início de partida, botão de TV, instruções PC/Android, ação de tela cheia, layout móvel e mensagem para arquivo faltante verificados no navegador, inclusive sob /SpaceInvaders/. Regras e servidor verificados por testes automatizados. Não houve teste com uma TV física. A correção só passa a existir no site público depois que você enviar esta versão e o GitHub Pages concluir a publicação.
