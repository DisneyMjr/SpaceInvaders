# Cenário 0.12

50 modelos utilizáveis foram incorporados, a partir de 53 modelos selecionados: rochas e pedras, um penhasco, cristais decorativos, ruínas, destroços e quatro modelos de recursos. Materiais e texturas vêm da instalação local; cores e geometria não foram redesenhadas. A galeria cenario.html permite inspecionar cada item.

## Distribuição no jogo

As pedras geométricas simples foram retiradas do terreno. O novo cenário combina famílias próprias dos quatro biomas com modelos comuns. A distribuição é determinística pela seed e respeita áreas livres de bases, depósitos de recursos e objetivos. O limite é de 240 objetos de cenário no computador e 90 no celular, agrupados em instâncias para reduzir o custo de desenho. A vegetação continua separada.

Foram recuperadas 4.828 posições de famílias reconhecidas nas 105 pastas de mapas. O jogo prioriza essas posições quando o modelo correspondente está disponível, dentro das áreas visíveis e limites de desempenho; completa o cenário com distribuição por bioma. Isso não reconstrói cada mapa integralmente. Alguns cenários não contêm posições das famílias selecionadas.

Minerais e vespeno usam modelos nativos, mantendo a coleta, esgotamento e salvamento do jogo. Minerais inicialmente ricos usam o estado Stand C disponível na conversão. Fontes de gás sem extrator permanecem na pose descoberta; os efeitos e estados de cobertura originais não foram portados.

## Alcance e limites

O catálogo amplo contém 13.729 arquivos M3 em 3.658 pastas. Inclui variantes numeradas, animações auxiliares, skins, vegetação, elementos de cenário e outros arquivos; não representa 13.729 objetos únicos jogáveis. Apenas os 50 modelos utilizáveis selecionados integram esta versão, além da vegetação e das construções anteriores. Todos os elementos do catálogo ainda não foram convertidos.

Três seleções (HavenRockArch, IceRockGiant e RedstoneRockSpires) não produziram geometria visível no conversor e foram excluídas do pacote de execução. São lacunas de conversão; os arquivos nativos contêm dados de modelo. As falhas e referências permanecem documentadas.

Rochas, penhascos, cristais decorativos, ruínas e destroços são elementos visuais nesta versão. Não reproduzem bloqueios de passagem, destruição, desmoronamentos ou colisões do motor original. A área de uma construção nova é liberada dos elementos decorativos. Não foram portados os shaders e emissores de partículas originais. As formas são normalizadas em escala para o mundo web; instâncias usam uma pose estática, com normais preservadas e sombras do motor web.
