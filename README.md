# SpaceInvaders 0.15 — Windows e web

## Jogar no Windows

Extraia todo o ZIP SpaceInvaders-Windows e abra SpaceInvaders.exe dentro da pasta. Mantenha os arquivos e pastas juntos. Não é necessário instalar Node.js. A versão é portátil e ainda não possui assinatura digital de editor.

Campanha e escaramuça funcionam localmente. O EXE inicia também um servidor de partidas e uma página web na porta TCP 48777. Você pode fechar o jogo para encerrar o servidor.

## Hospedar as partidas no seu computador (opção escolhida)

1. Reserve um IP local fixo para seu computador no roteador.
2. Encaminhe a porta TCP externa 48777 para a porta TCP 48777 desse computador.
3. Se o Windows perguntar, permita ao SpaceInvaders receber conexões na rede onde pretende hospedar. A ferramenta não altera regras de firewall ou roteador automaticamente.
4. Mantenha o SpaceInvaders.exe aberto. O anfitrião usa ws://127.0.0.1:48777/multiplayer.
5. Informe aos amigos ws://SEU-IP-PÚBLICO:48777/multiplayer. Todos escolhem Multiplayer, o mesmo código de sala e suas facções. O primeiro jogador escolhe o mapa; o segundo inicia a partida.
6. Sem instalar o EXE, um amigo pode abrir http://SEU-IP-PÚBLICO:48777/ no navegador e jogar no servidor do seu computador.

Na mesma rede, substitua SEU-IP-PÚBLICO pelo IP local do anfitrião. O teste entre redes depende de um IP público alcançável: se a operadora usa IP compartilhado/CGNAT, somente liberar a porta no roteador não basta; é necessário pedir acesso público à operadora ou usar outra solução de conexão. O endereço público pode mudar. Não houve alteração do roteador nem confirmação externa de porta aberta nesta entrega.

## GitHub e página web

O projeto foi preparado para https://github.com/DisneyMjr/SpaceInvaders, mas não foi enviado ou publicado automaticamente.

Extraia o pacote de código e envie seu conteúdo ao repositório. Não envie node_modules ou dist. Os modelos individuais permanecem abaixo do limite de 100 MB por arquivo; o ZIP Windows deve ser publicado como Release/artefato, não commitado no Git.

O workflow pages.yml publica a pasta web no GitHub Pages. Ative Settings → Pages → Source: GitHub Actions. O workflow windows.yml gera o ZIP Windows ao ser executado manualmente e pode publicá-lo numa Release ao enviar uma tag v*.

Uma página HTTPS do GitHub não conecta diretamente a ws:// sem TLS. Sem domínio, use o link da página para abrir o jogo HTTP no seu IP público, ou o EXE. Para jogar dentro da própria página HTTPS, será necessário oferecer um servidor wss:// com certificado válido. Ter um repositório não substitui o servidor de partidas.

## Desenvolver e executar o servidor separado

Requer Node.js 24 ou superior. Execute npm ci, depois node node_modules/electron/install.js para baixar o runtime oficial, npm test e npm start. npm run build:windows gera dist/SpaceInvaders-Windows no Windows. Para somente servidor/página web: npm ci --omit=dev e npm run server. HOST e PORT configuram o endereço; padrão 0.0.0.0:48777. O endpoint WebSocket é /multiplayer. Dockerfile também acompanha.

## Escopo do multiplayer

Duas pessoas por sala. O anfitrião mantém a simulação; o servidor encaminha comandos e estados. O hóspede recebe suas unidades e os inimigos visíveis, com névoa de guerra local. Movimento, produção, construção, pesquisa, transporte e encerramento são sincronizados. Ao sair ou perder conexão, a partida encerra: não há reconexão automática, migração do anfitrião, matchmaking ou modo competitivo com proteção contra trapaças. O anfitrião é confiável nesta arquitetura; o servidor não recalcula a batalha independentemente.

O núcleo de multiplayer e o runtime Windows foram validados na 0.14, incluindo uma sala entre EXE real e navegador. Nesta 0.15, as novas telas foram validadas em navegador desktop e celular emulado, com campanha offline e regressão de multiplayer entre navegadores; a janela nativa específica não foi retestada. Não há certificação de desempenho, internet externa ou celular físico.

## Recursos de terceiros

Os recursos recuperados da instalação local foram incorporados com base na autorização declarada pelo solicitante. A publicação no repositório não concede licença sobre recursos de terceiros. Consulte web/ORIGEM.md e os manifestos de proveniência. As campanhas e os sistemas ainda têm os limites descritos na documentação web.


## Interface 0.15

O menu foi reconstruído com navegação superior, quatro frentes de campanha, personagens em destaque, apresentação de campanha, seletor de dificuldade e central de partidas. As três frentes agrupam 41/38/26 cenários; o arquivo de operações reúne os 105. O progresso e os salvamentos anteriores mantêm as mesmas chaves do navegador. A coleção e o botão Continuar acessam os recursos existentes. Não foram criados botões que anunciem modo cooperativo ou replays inexistentes.

A arte dos comandantes e do ambiente orbital foi gerada para o projeto, inspirada na composição das referências do usuário. São imagens de menu, não novos modelos animados incorporados à batalha. O modo Brutal agora dá às tropas inimigas +25% de vida e +35% de dano fora do PvP; os outros níveis mantêm as regras anteriores. O balanceamento completo ainda não foi certificado.

A interface foi conferida em navegador desktop e celular emulado, inclusive início de campanha offline. A versão Windows usa o mesmo runtime e servidor da 0.14 com os arquivos da interface atualizados; a abertura nativa específica da 0.15 não foi repetida neste pacote.
