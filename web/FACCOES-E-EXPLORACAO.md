# Facções e exploração 0.13

A pesquisa local confirma agrupamentos terranos de operações especiais (Nova/CovertOps e Han/Horner), os protoss Tal’darim, Purificadores e Nerazim, e zergs primevos ligados a Dehaka. São subgrupos, tradições e exércitos dentro das raças; não foram descobertas novas raças oficiais. Fontes, linhas e hashes estão em proveniencia/sc2-faction-research/report.json.

Três facções originais foram criadas: Pacto do Véu (solar: velocidade +12%, dano +5%, vida -5%); Coro de Sílex (aether: vida +18%, dano +8%, velocidade -10%); Prole Raiz-Negra (swarm: vida +12%, dano +12%, velocidade +4%, regeneração 1/s). Esses modificadores são regras novas do projeto. As novas opções herdam os modelos, áudio, tropas e construções da raça correspondente; não são árvores tecnológicas nativas completas dos subgrupos nem modelos exclusivos recuperados para eles. Cores de identificação diferenciam as alianças.

## Encontros

Novas escaramuças sorteiam uma base principal e dois acampamentos inimigos, com facções variadas e distância segura da base do jogador. O terreno mantém sua seed; a distribuição de encontros recebe uma seed independente a cada partida e é preservada no salvamento. Carregar não sorteia outra partida. Não há aparecimento infinito arbitrário de inimigos ao lado do jogador.

Nas 105 adaptações de campanha, as posições iniciais das tropas inimigas variam até cinco unidades por eixo, com limites do cenário; objetivos, bases, equipes neutras e personagens essenciais mantêm seus locais. Subfacções compatíveis podem substituir o grupo inimigo inicial sem mudar as classes de unidade. Ondas roteirizadas mantêm a lógica de cada adaptação.

## Névoa de guerra

O mapa usa células de quatro unidades e visão circular das tropas/construções de cada equipe. Unidades inimigas e neutras fora da visão ficam ocultas e não são escolhidas pelo clique ou ataque automático. A visão é recalculada periodicamente. Terreno desconhecido é escurecido; regiões exploradas sem visão atual ficam sombreadas. Recursos aparecem após exploração. O minimapa oculta tropas inimigas fora de visão e conserva a última posição conhecida de estruturas até a área ser revisitada. Construção exige visão atual do local. Exploração e memória são salvas, com compatibilidade de partidas anteriores sem dados de névoa.

Esta é uma implementação web própria, não o sistema do motor original. Ainda não calcula oclusão por penhascos/altura, linha de visão por obstáculos, invisibilidade/detecção ou silhuetas tridimensionais completas de estruturas lembradas. A IA faz exploração e tem restrição de visão na escolha de alvos; não reproduz a inteligência ou o balanceamento originais. O PvP permanece experimental e sem garantia de sincronização completa desses sistemas.
