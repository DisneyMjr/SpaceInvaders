# Validação 0.14

41 testes automatizados passaram: 39 regras do jogo e dois testes do servidor de salas/HTTP. Foram conferidos entrada de dois jogadores, configuração compartilhada, rejeição de terceiro jogador, encaminhamento de comandos/estados, limites de destino, encerramento por desconexão e bloqueio de caminhos indevidos no servidor de arquivos.

Duas sessões independentes de navegador passaram pelo teste integrado: facções diferentes, seed compartilhada, movimento, produção e construção do hóspede sincronizados; filtragem de inimigos não vistos; encerramento por saída do anfitrião. Resultado em multiplayer-qa.json. Teste local, sem certificação de balanceamento, latência de internet ou anti-trapaça.

O runtime Electron 45.2.1 foi baixado pela ferramenta oficial com verificação de checksum; o pacote Windows inclui runtime, página e servidor. A tentativa de testar a janela foi bloqueada por uma exigência de ACL no diretório gerado. A revisão automática rejeitou a ampliação de leitura/execução a todos os AppContainers, e o usuário escolheu manter as permissões. Nenhuma ACL foi alterada. Não é possível afirmar que a janela do EXE foi validada neste ambiente.

Não foram alterados roteador, firewall ou repositório remoto. A porta pública não foi verificada por um computador externo. O pacote GitHub contém workflows preparados; publicação e Releases só ocorrerão após envio e configuração no repositório.
