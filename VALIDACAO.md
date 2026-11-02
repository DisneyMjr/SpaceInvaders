# Validação — histórico 0.14 e interface 0.15

41 testes automatizados passaram: 39 regras do jogo e dois testes do servidor de salas/HTTP. Foram conferidos entrada de dois jogadores, configuração compartilhada, rejeição de terceiro jogador, encaminhamento de comandos/estados, limites de destino, encerramento por desconexão e bloqueio de caminhos indevidos no servidor de arquivos.

Duas sessões independentes de navegador passaram pelo teste integrado: facções diferentes, seed compartilhada, movimento, produção e construção do hóspede sincronizados; filtragem de inimigos não vistos; encerramento por saída do anfitrião. Resultado em multiplayer-qa.json. Teste local, sem certificação de balanceamento, latência de internet ou anti-trapaça.

O runtime Electron 45.2.1 foi baixado pela ferramenta oficial com verificação de checksum. O EXE empacotado abriu a janela, iniciou o servidor embutido e entrou numa sala compartilhada com um navegador Chrome em formato de celular/toque. O pedido de produção do hóspede foi recebido e sua fila sincronizada. JavaScript da página permaneceu sem acesso ao Node.js. Nenhum erro de página foi observado nesse teste.

Após autorização específica do usuário, foi concedida leitura/execução a ALL APPLICATION PACKAGES somente em dist/SpaceInvaders-Windows, sem escrita nem alterações em outras pastas. Isso resolveu a restrição inicial de acesso do Electron. A automação usou gráficos por software, uma opção de teste que desativa o sandbox de processos do Chromium e limitação da frequência de renderização. Esses parâmetros não foram incorporados ao aplicativo distribuído. O teste não certifica o comportamento sob carga, uma sessão humana prolongada, um celular físico ou conexão de internet externa. Resultado em windows-qa.json.

Não foram alterados roteador, firewall ou repositório remoto. A porta pública não foi verificada por um computador externo. O pacote GitHub contém workflows preparados; publicação e Releases só ocorrerão após envio e configuração no repositório.


## Interface 0.15

43 testes automatizados passaram, incluindo particionamento das campanhas, quatro dificuldades e entrega de CSS com o tipo correto. A navegação no navegador conferiu campanha, apresentação, busca/filtro das operações, dificuldade, partida salva, coleção, configuração multiplayer e início offline por toque no celular emulado. Resultado em interface-qa.json. O núcleo de salas e o runtime Windows são os mesmos da 0.14; a janela nativa específica da 0.15 não foi retestada.
