# Vegetação nativa recuperada

Foram recuperados **14 modelos M3 e 27 texturas DDS**, totalizando **8.419.188 bytes**, da instalação local StarCraft II 5.0.17.98310. Todos os arquivos foram decodificados e conferidos por SHA-256, sem erros ou referências de textura ausentes.

## Conjunto selecionado

| Ambiente sugerido | Elementos nativos |
| --- | --- |
| Verde | BelShirTree, AgriaTree, BelShirBush, BelShirShrub, AgriaUnderbrush, BelShirFoliage e Shakuras TallGrass |
| Deserto | MarSaraTree, MarSaraCactus e MarSaraTreeDead |
| Neve | SnowTrees e HeavySnowTree |
| Vulcânico | CharTree e CharTreeSpiny |

Os nomes indicam as famílias nativas; a seleção usa uma variante representativa de cada família. O enquadramento por bioma é uma recomendação para o SpaceInvaders, não uma reprodução das distribuições de cada mapa do StarCraft II. BelShirFoliage pode incluir vegetação de maior porte, apesar do nome genérico.

`source-manifest.json` registra os 41 arquivos e seus caminhos CASC, tamanhos e hashes. `vegetation-selection.json` relaciona cada modelo às suas texturas, tipo e bioma sugerido. Os arquivos nativos ficam em `outputs/sc2-extracted/mods/liberty.sc2mod/base.sc2assets/Assets/`.

## Procedência e leitura local

A instalação original foi aberta apenas para leitura. A ferramenta usa a biblioteca CASCLib/CASCExplorer 0.17-alpha, com as correções de compatibilidade de leitura já documentadas no projeto. Uma compilação separada desativa os métodos online do manipulador S2; os conteúdos foram abertos diretamente pelo leitor local, sem fallback para CDN. Os destinos de extração são validados para permanecer dentro da pasta de saída.

Não houve recoloração, redesenho de geometria ou substituição das imagens nesta recuperação. A conversão posterior para glTF/PNG muda o formato de apresentação e pode limitar resolução ou aproximar materiais. Shaders, translucidez, vento procedural e iluminação originais não são automaticamente reproduzidos pelo motor web; os relatórios de conversão documentam esses limites.

Os direitos seguem a autorização de uso declarada pelo usuário na conversa. Este conjunto não concede uma licença adicional sobre os recursos nativos.
