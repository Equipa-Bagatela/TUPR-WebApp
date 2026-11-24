# Reguamove: identidade visual (logótipo e ícone)

Instruções para pôr isto no site (pensado para dar ao Claude Code).

## O que fazer

1. Copiar para a pasta pública do site (`public/` ou equivalente), na raiz, estes ficheiros:
   `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`,
   `icon-maskable-512.png`, `site.webmanifest`, `og-image.png`.
2. Acrescentar ao `<head>` as linhas de `head-snippet.html` (ou o equivalente da framework).
   Substituir `[URL DO SITE]` pelo endereço público e preencher a descrição.
3. Se o site já tiver favicon ou manifest, substituir em vez de duplicar.
4. Usar o logótipo no cabeçalho: `logo-horizontal-claro.svg` em fundo claro e
   `logo-horizontal-escuro.svg` em fundo escuro (ver o aviso sobre a fonte abaixo).

## Cores

| Uso | Valor |
| --- | --- |
| Azul (fundo do ícone, M no fundo claro, `theme-color`) | `#143c57` |
| Verde da bolinha e de "move" em fundo escuro | `#a6d062` |
| Verde de "move" em fundo claro (contraste) | `#5c962b` |
| Faixa do rio no ícone | `#6a94b1` |

## Aviso sobre a fonte

O nome "Reguamove." usa **Space Grotesk Bold (700)**, tipo de letra gratuito (Google Fonts).
Os logótipos horizontais (`logo-horizontal-*.svg`) têm o nome como **texto**, não como contornos,
porque a fonte não estava disponível quando foram gerados. Por isso:

- Se forem usados como `<img src>`, o browser não carrega a fonte e o nome aparece noutra letra.
  Nesse caso, colar o SVG inline no HTML (com a fonte carregada na página) ou converter o texto em
  contornos (Inkscape: Caminho > Objeto para caminho) e guardar de novo.
- A forma do M, o ícone, o favicon e a imagem de partilha **não** dependem da fonte.
- Os espaços à volta do nome (largura do SVG) são uma estimativa: ajustar o `viewBox` se sobrar espaço à direita.

## Ficheiros

- `favicon.svg`, `favicon.ico`, `png/favicon-16|32|48.png`: separador do browser
- `apple-touch-icon.png` (180 px, quadrado, sem cantos): ecrã inicial do iPhone
- `icon-192.png`, `icon-512.png`: ícone da app instalada; `icon-maskable-512.png`: versão com margem de segurança para Android
- `icon.svg`: ícone quadrado, fonte para exportar noutros tamanhos
- `simbolo-claro.svg`, `simbolo-escuro.svg`: só o M com a bolinha, sem texto
- `og-image.png` / `og-image.svg`: imagem de partilha 1200×630 (sem o nome, ver aviso acima)
- `site.webmanifest`: nome, cor e ícones da app instalável

Este é um projeto não oficial: não usar brasão, bandeira nem qualquer elemento da Câmara Municipal.
