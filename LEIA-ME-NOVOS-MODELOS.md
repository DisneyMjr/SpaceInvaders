# SpaceInvaders 0.18 — 49 modelos detalhados

Esta é a cópia atualizada do jogo, com os personagens e veículos das seis facções substituídos.

## Abrir

No Windows deste computador, abra **JOGAR-PREVIA.cmd**. O lançador usa o Python já instalado e abre o jogo no navegador. Para explorar os modelos, escolha **Coleção → Unidades e animações**. A janela do servidor pode ser fechada para encerrar a prévia.

Campanha e escaramuça funcionam nessa prévia local. As instruções do servidor multiplayer e do aplicativo Electron continuam no README do projeto. Esta entrega contém o projeto atualizado e o lançador de prévia; não foi produzido um novo executável Windows.

## Modelos

- **49 GLBs:** oito funções para cada uma das seis facções e um transporte de apoio.
- **Solar e Véu:** soldados com armaduras, equipamentos por função, blindados de seis rodas e aeronaves VTOL.
- **Aether e Sílex:** robôs com juntas mecânicas, plataformas quadrúpedes e drones de quatro rotores; Sílex recebe detalhes de fornalha.
- **Vorax e Raiz-Negra:** criaturas de quitina, organismos de cerco e seres alados; Raiz-Negra recebe raízes, espinhos e órgãos de tonalidade âmbar.
- Nove bases detalhadas, com cerca de 50 mil triângulos cada, complementadas por equipamentos e características próprias das variantes.
- Três mapas de textura por base: cor, normal e metal/rugosidade. As fontes em 4K foram preservadas; durante o jogo, o carregador usa uma cópia menor em memória.
- Animações de espera, movimento e ataque em todas as entradas. Os movimentos dos personagens foram adaptados das animações disponíveis no jogo; veículos, quadrúpedes, rotores e asas receberam ciclos próprios.

O inventário completo está em **web/assets/realistic-units/inventory.json**. Os GLBs de jogo compartilham PNGs dessa mesma pasta: ao copiar um modelo para outra ferramenta, mantenha os arquivos de textura juntos.

## Integração e verificação

Todas as 49 entradas ativas usam a pasta realistic-units. Os protótipos em blocos foram retirados da entrega. Custos, atributos, campanhas, construções e regras de combate continuam os do projeto.

Foram aprovados **99 testes**: 55 de modelos/animações e 44 do jogo. Consulte VALIDACAO-NOVOS-MODELOS.md para o alcance da verificação e web/ORIGEM.md para a procedência dos recursos.

Revisão de 5/11: placas coloridas sobrepostas substituídas por sensores, cabos e reservatórios nos modelos mecânicos. Os 49 modelos foram revisados; texturas e animações preservadas.

Apresentação: barra inferior e miniaturas usam retratos dos nossos modelos por unidade e facção. Menu com poses e luz de facção, câmera aproximada, cores das bases e efeitos de destruição atualizados. Qualidade gráfica adapta resolução e sombras à quantidade de entidades.

Revisão adicional: construções com geometria própria no jogo e em construcoes.html; caminhada, mira e reação a dano refinadas; avisos de ataque e resumo da produção; geometria leve à distância. 103 testes aprovados. Teste gráfico em desempenho.html. Exércitos de 160 unidades ainda têm limite de fluidez nesta máquina.

Construções detalhadas concluídas: base militar Solar/Véu, fábrica industrial Aether/Sílex e colmeia Vorax/Raiz-Negra disponíveis nas sedes e construções de produção. Defesa, apoio e tecnologia continuam com modelos próprios anteriores. Não há download pendente. Recarregue a aba para receber a revisão de cache 18.


# Construções realistas instaladas

As três sedes detalhadas e os nove novos modelos estão instalados na cópia atualizada do jogo. Defesa, tecnologia e serviços/extração usam modelos próprios militares Solar, industriais Aether e orgânicos Vorax. Véu, Sílex e Raiz-Negra recebem os modelos da família com seus acabamentos de facção. São 12 fontes detalhadas para os 106 itens do catálogo; itens da mesma categoria compartilham modelo. Não são 106 modelos diferentes.

Os nove downloads foram identificados visualmente e preservados em fontes-restantes/, com hashes no manifesto. Uma cópia duplicada em Downloads não foi importada novamente. Nenhum arquivo de Downloads foi apagado.

As fontes têm cerca de 50 mil faces e três mapas PBR 4K por modelo. O carregador reduz somente a textura em memória. Os prédios são estáticos; não possuem animação de torre ou partes móveis.

Validação de 5/11/2026: 14 testes de modelos, categorias e integração passaram, incluindo as seis facções, escala e chão; 45 testes do jogo também passaram. Os nove modelos foram vistos no visualizador local, sem erros no console. O enquadramento foi ajustado para estruturas altas. Não foi feita medição de desempenho de uma partida com muitas destas construções.

Abra http://127.0.0.1:8788/construcoes.html ou use JOGAR-PREVIA.cmd na pasta do jogo atualizado. Cache atualizado para buildings20. Nenhum GLB deste lote está pendente.

Origem: as sedes vieram de referências visuais originais; os nove novos modelos foram gerados no Tencent Text-to-3D com descrições originais, após a análise das imagens falhar. As imagens em restantes/ são estudos visuais e não conversões exatas dos modelos finais.
