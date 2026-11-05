# Origem dos recursos — SpaceInvaders v0.13

O usuário declarou nesta conversa ter autorização para incorporar e distribuir os recursos extraídos. Essa declaração orientou este trabalho; não foi feita verificação documental da autorização.

## Instalação de origem

`C:\Program Files (x86)\StarCraft II`, versão 5.0.17.98310. A instalação foi aberta para leitura; os arquivos extraídos e convertidos foram escritos somente na pasta deste trabalho.

Extração selecionada: 30 modelos M3, 244 texturas DDS e oito áudios (três WAV de armas e cinco OGG de vozes/chamadas, quatro com localização PT-BR). São 147.744.916 bytes de recursos nativos. Não é uma extração de todos os arquivos do StarCraft II.

O pacote de jogo contém os 30 modelos convertidos em GLB, com 119 imagens PNG incorporadas e 513 clipes de animação; oito arquivos de áudio foram convertidos para WAV PCM16. As imagens foram limitadas a 512 pixels no maior lado para reduzir o tamanho e a memória. Os materiais convertidos não reproduzem integralmente os shaders originais. Partículas, projeções e luzes M3 foram omitidas.

Os arquivos nativos, seus caminhos no armazenamento CASC, tamanhos e hashes estão entregues separadamente em `sc2-extracted`. Relatórios individuais documentam a relação entre cada M3/DDS e o GLB produzido. Todos os recursos permanecem de seus respectivos titulares; este pacote não concede uma licença adicional sobre eles.

## Ferramentas

- CASCExplorer/CASCLib 0.17-alpha, a partir de https://github.com/WoW-Tools/CASCExplorer. Cópia da biblioteca de extração foi compilada com leituras explícitas, correção de compatibilidade Windows e busca direta dos caminhos. Não foi instalada no sistema.
- m3-to-glb 0.2.0: https://github.com/AestroFidelium/m3-to-glb. Conversão feita fora do navegador; o executável não acompanha o jogo.
- Pillow, para converter as texturas DDS/TGA para PNG.
- python-soundfile 0.13.1/libsndfile, para decodificar os WAV ADPCM e OGG e escrever WAV PCM16.
- Validador glTF oficial Khronos, usado para verificar cada arquivo GLB.

## Código e dependências

A base do Confluência Astral v0.5 foi recuperada de https://gdtec.com.br/novafronteira/. As regras de jogo e as melhorias v0.6/v0.7 foram mantidas como implementação do projeto. O site remoto não foi alterado.

Three.js 0.169.0 permanece acompanhado de sua licença MIT em `vendor/three/LICENSE`; os hashes estão em `vendor/three/PROVENANCE.json`. Os três comandantes procedurais da v0.5 permanecem apenas como alternativa se um modelo não puder ser carregado.


## Personalização v0.8 e terrenos

Os 30 GLBs da v0.7 foram copiados para uma nova versão e alterados offline. O manifesto `model-design/customization-manifest.json` registra hashes de origem/saída, peças adicionadas, articulação utilizada e validação. A estrutura de animação e as imagens foram preservadas. Alterações de paleta, materiais e geometria são próprias desta edição, sobre a base derivada autorizada.

Foram extraídos mais 16 DDS de materiais de chão Belshir, Marsara, Iceworld e Char. Os arquivos originais não foram alterados. `terrain-design/manifest.json` registra os caminhos CASC, hashes, transformações e nove PNGs resultantes. Cores, detalhes, normais e emissão foram recompostos; a geometria de mapa não foi extraída. O relevo do SpaceInvaders é gerado pelo código `terrain-math.mjs`.


## Campanha v0.13

Arquivos nativos de mapas foram recuperados da instalação local. Manifestos no pacote separado registram caminhos, hashes, bytes, disponibilidade local e a distinção entre arquivo listado e recuperado. Os scripts não são executados pelo site.

Seis grades HMAP foram decodificadas conforme os parâmetros de quantização do XML e conferidas com os dados do mapa. Para apresentação, a altura foi centralizada pela mediana, escalada e limitada a ±5; a grade foi reduzida a 65 × 65. O motor aplica interpolação, transição para o mundo procedural e nivelamento perto de construções. A navegação e as falésias nativas não acompanham automaticamente essa transformação.

Os objetivos, ondas, marcadores e regras das seis operações jogáveis foram escritos em JavaScript para o SpaceInvaders. Nomes e atores encontrados nas fontes não foram tratados como instruções para executar código no computador.


## Adições 0.10

Vegetação: 14 M3 e 27 DDS locais, convertidos para 14 GLBs com materiais/texturas nativos. Efeitos: quatro M3 de referência e dez DDS convertidos para PNG. Os M3 de partículas servem como referência; seus emissores não são executados. As imagens dos ataques mantêm cor e alfa, com adaptação de temporização e mistura no motor web.

Cenários: 105 pastas recuperadas localmente; 95 possuem relevo utilizável. O catálogo contém também cenas, treino e testes. Cada adaptação registra origem e limites em campaign-generated.mjs e campaign-design/adaptation-coverage.json. Os scripts Galaxy não são executados.


## Construções 0.11

53 construções principais e duas variantes clássicas: 52 GLBs distintos, 79.474.144 bytes, 229 imagens e 574 clipes. Referências e arquivos selecionados foram recuperados localmente com hashes e sem alterar a instalação. Variantes Orbital/Planetary/WarpGate usam estados nativos compartilhados com evidência em shared-animation-evidence.json. Catálogo amplo registra 1.955 M3 sem afirmar que todos sejam construções jogáveis.


## Cenário 0.13

53 modelos e 135 DDS selecionados, 188 arquivos nativos e 84.868.088 bytes recuperados estritamente da instalação local, com hashes, sem alterações na origem. 50 modelos produziram GLBs utilizáveis: 54.768.368 bytes, 137 imagens incorporadas e 44 clipes. Três modelos não geraram geometria visível no conversor e não integram a execução. Evidências e catálogo em proveniencia/sc2-scenery-recovery.


Atualização 0.13: três novas facções originais inspiradas nos subgrupos locais, encontros aleatórios e névoa de guerra. Consulte FACCOES-E-EXPLORACAO.md para funcionamento e limites.


## Arte de menu 0.15

Comandantes e ambiente orbital criados com geração de imagens para este projeto, a partir de descrições inspiradas na composição das referências fornecidas pelo usuário. As figuras são imagens estáticas usadas nas telas de navegação; não foram extraídas das capturas nem representam portabilidade dos personagens ou menus nativos completos. Os controles, plataformas, molduras, indicadores e demais elementos de interface são implementados em HTML/CSS/JavaScript.


## Unidades detalhadas 0.18 — 4 de novembro de 2026

As 49 entradas ativas de personagens e veículos foram substituídas por modelos da pasta assets/realistic-units. Nove bases novas foram geradas na conta do usuário no Tencent HY 3D Global, a partir de descrições próprias e da direção visual aprovada: militar futurista, robótica industrial e alienígena orgânica. A referência Solar foi criada com geração de imagem; os demais modelos-base foram gerados por descrições de texto. Os protótipos geométricos em blocos desta etapa foram retirados da distribuição.

Equipamentos, blindagens, órgãos, raízes, pás e acessórios das variantes foram modelados localmente. As novas malhas e suas texturas não foram copiadas dos antigos personagens ou veículos. Os movimentos dos personagens usam adaptações autorizadas das animações do Marine disponível no projeto; articulações e ciclos dos veículos, plataformas, rotores e criaturas aladas foram produzidos nesta atualização. O inventário assets/realistic-units/inventory.json registra a base, personalização, animações e mapas de cada entrada.

Os mapas PBR fornecidos pelas gerações foram preservados em PNG e compartilhados entre variantes; a redução para 1024 pixels ocorre apenas no carregamento em memória. Os recursos de construções, cenário, retratos e áudio descritos nas seções históricas anteriores continuam com sua procedência original.

Revisão 5/11/2026: a geometria ativa das construções passou a ser gerada por faction-structures.mjs, com arquitetura militar, industrial e orgânica própria e texturas de painéis geradas por código. Os arquivos de construções anteriores permanecem no pacote para referência, mas media.mjs não os carrega nas partidas. model-detail.mjs cria versões leves em memória dos nossos modelos, preservando os GLBs de fonte.

Construções realistas: modelos de fábrica industrial e colmeia gerados no Tencent HY 3D a partir de referências originais produzidas com imagegen em 5/11/2026. Fontes GLB e referências preservadas em outputs/construcoes-realistas. Geometria e mapas extraídos sem alterar o modelo de origem; nenhuma geometria de construções do jogo anterior é usada nesses dois modelos.

Base militar Solar gerada no Tencent a partir de solar-comando-referencia.png, recebida em 5/11/2026 como 33085a4a05d564b6251a0ab197c17f61.glb. Fonte preservada em outputs/construcoes-realistas/solar-comando-tencent.glb. Ativa também no Véu com acabamento de facção.


# Construções realistas instaladas

As três sedes detalhadas e os nove novos modelos estão instalados na cópia atualizada do jogo. Defesa, tecnologia e serviços/extração usam modelos próprios militares Solar, industriais Aether e orgânicos Vorax. Véu, Sílex e Raiz-Negra recebem os modelos da família com seus acabamentos de facção. São 12 fontes detalhadas para os 106 itens do catálogo; itens da mesma categoria compartilham modelo. Não são 106 modelos diferentes.

Os nove downloads foram identificados visualmente e preservados em fontes-restantes/, com hashes no manifesto. Uma cópia duplicada em Downloads não foi importada novamente. Nenhum arquivo de Downloads foi apagado.

As fontes têm cerca de 50 mil faces e três mapas PBR 4K por modelo. O carregador reduz somente a textura em memória. Os prédios são estáticos; não possuem animação de torre ou partes móveis.

Validação de 5/11/2026: 14 testes de modelos, categorias e integração passaram, incluindo as seis facções, escala e chão; 45 testes do jogo também passaram. Os nove modelos foram vistos no visualizador local, sem erros no console. O enquadramento foi ajustado para estruturas altas. Não foi feita medição de desempenho de uma partida com muitas destas construções.

Abra http://127.0.0.1:8788/construcoes.html ou use JOGAR-PREVIA.cmd na pasta do jogo atualizado. Cache atualizado para buildings20. Nenhum GLB deste lote está pendente.

Origem: as sedes vieram de referências visuais originais; os nove novos modelos foram gerados no Tencent Text-to-3D com descrições originais, após a análise das imagens falhar. As imagens em restantes/ são estudos visuais e não conversões exatas dos modelos finais.
