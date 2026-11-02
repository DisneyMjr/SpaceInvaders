# Texturas e referências de efeitos de ataque

Foram recuperados **quatro M3 de efeitos e dez texturas DDS** da instalação local StarCraft II 5.0.17.98310. A leitura foi feita pela biblioteca offline já documentada no projeto, sem alterações na instalação ou fallback de download.

Os M3 são MarineWeaponLaunch, MarineWeaponImpact, StalkerMissileImpact e RoachWeaponImpact. Eles foram recuperados para identificar referências e servir de evidência do conjunto nativo; não foram portados como sistemas de partículas completos. A seleção de texturas não pretende recuperar todas as dependências desses quatro efeitos.

## Imagens para o motor web

| Arquivo PNG | Uso sugerido | Grade | Mistura sugerida |
| --- | --- | --- | --- |
| fireball | Fogo/explosão | 1 × 1 | Aditiva |
| muzzle-glow | Clarão de disparo | 1 × 1 | Aditiva |
| sparks | Faíscas de impacto | 2 × 2 | Aditiva |
| smoke | Fumaça | 1 × 1 | Alfa normal |
| shockwave | Anel de energia | 1 × 1 | Aditiva |
| plasma-glow | Energia azul | 1 × 1 | Aditiva |
| lightning | Descarga de energia | 1 × 1 | Aditiva |
| acid-ball | Projétil de gosma/ácido | 1 × 1 | Alfa normal |
| acid-splat | Impacto de gosma/ácido | 4 × 4 | Alfa normal |
| acid-glow | Energia verde | 1 × 1 | Aditiva |

Todas as PNGs preservam as cores e o canal alfa decodificados. As dimensões nativas variam de 64 a 256 pixels, portanto não houve necessidade de aumentar ou reduzir resolução. Não foi aplicada recoloração.

Fireball, muzzle-glow, sparks e shockwave possuem alfa nativo inteiramente opaco e fundo RGB preto. Devem usar mistura aditiva ou tratamento equivalente para que o fundo não apareça como um quadrado. As demais imagens mantêm transparência nativa variável.

As grades de sparks e acid-splat foram conferidas visualmente na imagem nativa. A origem de quadros é o canto superior esquerdo. A ordem e a duração da reprodução no navegador são escolhas da implementação adaptada; não foram recuperadas como temporização dos emissores nativos.

`texture-manifest.json` registra fonte, hashes, dimensões, alfa, grade, mistura e os M3 que referenciam cada textura. `source-manifest.json` registra os 14 arquivos nativos. `effect-model-references.json` preserva todas as referências DDS observadas nesses quatro M3. `contact-sheet.png` mostra a seleção. A pasta de execução inclui `registry.mjs` com caminhos e propriedades para o emissor web.

O uso das imagens nativas não reproduz automaticamente os shaders, luzes, trilhas, orientação, física, emissão, escala ou sincronização dos efeitos originais. Esses comportamentos precisam ser implementados e testados no SpaceInvaders.
