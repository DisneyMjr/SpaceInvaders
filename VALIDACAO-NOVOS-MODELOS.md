# Validação — modelos detalhados 0.18

Data: 5 de novembro de 2026.

- **49 de 49 entradas ativas** apontam para GLBs detalhados próprios, com arquivos distintos para as seis facções e o transporte.
- **55 testes de modelos aprovados:** leitura com o GLTFLoader do projeto, geometria preservada, mapas locais, pesos/esqueletos, movimentos finitos, contato com o chão e limites de deformação.
- **44 testes do jogo aprovados:** campanhas, terreno, construções, produção, névoa, menus, resolução dos modelos e publicação.
- Os testes específicos verificam giro das seis rodas, recuo de torres, pés nivelados nos quadrúpedes, pás visíveis nos quatro rotores e deformação das duas membranas aladas.
- Os mapas de textura são compartilhados por base: 27 PNGs para nove bases. Os 49 GLBs ativos somam 164.191.552 bytes e os mapas somam 373.241.024 bytes.
- Hangar conferido no navegador com modelos texturizados e movimentos. Uma escaramuça Solar carregou as novas unidades, seleção de exército e ordem de deslocamento sem erros no console.
- Manifesto web regenerado e aprovado: 617 arquivos com referências e integridade verificadas.

## Alcance

A revisão cobre os novos personagens e veículos. Cenários, construções, retratos, áudio e regras anteriores foram preservados. Não houve novo pacote Electron, partida PvP ou medição de desempenho com exércitos grandes. O servidor de prévia é destinado ao jogo solo; o relay multiplayer continua dependendo da instalação Node.js descrita no README.

Revisão de acabamento: os 49 modelos foram revisados. Em 31 personagens, robôs e veículos mecânicos, placas lisas e caixas sobrepostas foram substituídas por sensores ópticos, cabos, reservatórios e equipamentos compactos com acabamento neutro. Drones e criaturas preservam rotores e estruturas orgânicas funcionais. Texturas e animações preservadas; os 99 testes foram executados novamente e aprovados.

Revisão da apresentação em 5/11: retratos da barra inferior e miniaturas renderizados a partir dos GLBs da unidade selecionada, com suporte às seis facções; menu com pose de ataque e luz da facção. Câmera inicial aproximada; construções recebem coloração discreta e emissivos da facção. Destruição orgânica/mecânica e impactos com identidade cromática. Painel atualizado a 10 Hz (barras de vida continuam por quadro); resolução e sombras reduzidas acima de 80 entidades e resolução adicional acima de 140. Os 44 testes do jogo foram repetidos e aprovados. Partida Vorax conferida com seleção de infantaria, coletores e destruição, sem erros no console. Não foi feita medição de FPS com exércitos grandes nesta revisão; o terreno e a geometria das construções existentes foram preservados.

Revisão seguinte: 103 testes aprovados (45 do jogo/construções e 58 de modelos/animações/LOD). Geometria própria das construções passou a substituir a anterior nas partidas e no visualizador. Novos avisos de ataque e fila global; nomes curtos; animação ajustada ao deslocamento, mira e reação a dano. Teste gráfico 160 unidades: 8.822.150 → 737.995 triângulos e 5,4 → 12,0 FPS nesta sessão; não equivale a batalha completa. A medição de 30 unidades variou para pior e não demonstra ganho nessa faixa. Mais detalhes em MELHORIAS-05-NOV.md, na pasta de entregas.

Construções detalhadas Tencent: fábrica Aether/Sílex e colmeia Vorax/Raiz-Negra instaladas nas sedes e construções de produção, com cerca de 50 mil faces e 3 mapas PBR em cada base. Duas fontes importadas, verificadas visualmente no visualizador sem erros de console; 45 testes do jogo e dois testes específicos dos GLBs aprovados nesta revisão. Base militar Solar pendente de download; defesa/apoio/tecnologia mantêm modelos procedurais.

Encerramento da integração disponível: teste adicional de sede, produção e apoio nas seis facções aprovado, com validação de escala, contato com chão, materiais, anéis e escolha dos modelos disponíveis. Total registrado: 106 testes aprovados (45 jogo, 61 modelos/integração), somando revisões anteriores e os três testes novos. Não houve novo teste visual de partida nesta etapa porque a ferramenta de navegação ficou indisponível. O usuário optou por deixar a base militar pendente e avisará quando baixar.

Base militar recebida e integrada: solar-comando-tencent.glb preservado; base detalhada ativa em Solar/Véu nas sedes e produção. As três fontes PBR e a integração nas seis facções passaram em quatro testes nesta etapa. Total registrado 107 (45 jogo, 62 modelos/integração), contando revisões anteriores. Não houve nova conferência visual da base militar devido à indisponibilidade da ferramenta de navegação. Downloads das três famílias concluídos; cache 18.

Preparação das construções restantes: nove referências 2D de defesa/tecnologia/serviços geradas, verificadas e salvas em outputs/construcoes-realistas/restantes; nenhuma destas nove foi convertida em GLB ou instalada. Seletor de categorias preparado com registro apenas de arquivos existentes e manutenção dos modelos atuais quando falta o GLB. Cinco testes de categorias/integração/fontes aprovados; novo teste eleva o total registrado a 108, incluindo revisões anteriores. Cache 19. Controle de navegador e controle alternativo de computador indisponíveis nesta sessão.


# Construções realistas instaladas

As três sedes detalhadas e os nove novos modelos estão instalados na cópia atualizada do jogo. Defesa, tecnologia e serviços/extração usam modelos próprios militares Solar, industriais Aether e orgânicos Vorax. Véu, Sílex e Raiz-Negra recebem os modelos da família com seus acabamentos de facção. São 12 fontes detalhadas para os 106 itens do catálogo; itens da mesma categoria compartilham modelo. Não são 106 modelos diferentes.

Os nove downloads foram identificados visualmente e preservados em fontes-restantes/, com hashes no manifesto. Uma cópia duplicada em Downloads não foi importada novamente. Nenhum arquivo de Downloads foi apagado.

As fontes têm cerca de 50 mil faces e três mapas PBR 4K por modelo. O carregador reduz somente a textura em memória. Os prédios são estáticos; não possuem animação de torre ou partes móveis.

Validação de 5/11/2026: 14 testes de modelos, categorias e integração passaram, incluindo as seis facções, escala e chão; 45 testes do jogo também passaram. Os nove modelos foram vistos no visualizador local, sem erros no console. O enquadramento foi ajustado para estruturas altas. Não foi feita medição de desempenho de uma partida com muitas destas construções.

Abra http://127.0.0.1:8788/construcoes.html ou use JOGAR-PREVIA.cmd na pasta do jogo atualizado. Cache atualizado para buildings20. Nenhum GLB deste lote está pendente.

Origem: as sedes vieram de referências visuais originais; os nove novos modelos foram gerados no Tencent Text-to-3D com descrições originais, após a análise das imagens falhar. As imagens em restantes/ são estudos visuais e não conversões exatas dos modelos finais.
