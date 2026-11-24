# Reguamove · Horários TUPR (não oficial)

Webapp (React + Vite + TypeScript + Tailwind + Leaflet) para consultar horários, planear viagens e ver as próximas partidas do TUPR.

> **Projeto isolado e não oficial da Bagatela.** Os horários são informação pública e podem estar desatualizados.

```bash
npm install
npm run dev      # desenvolvimento
npm test         # dados, planeador, pesquisa, feriados e formulário (25 testes)
npm run build    # produção (dist/)
```

## Origem dos dados

Os horários do TUPR são informação pública, aqui transcritos para dados estruturados:

- **Linha Verde**: 39 posições de paragem × 12 viagens. **Linha Vermelha**: 33 × 12.
- Duas linhas **circulares**, de segunda-feira a sábado, partidas de hora a hora (08:00–19:00) na R. Fernando Augusto Bandeira.
- As viagens das **18:00 e 19:00 não se realizam ao sábado** → `days: 'mon-fri'`.
- Tarifário em `src/data/tariffs.ts`.
- Cores das linhas: `#416e48` (verde) e `#c12a2b` (vermelha).

Os horários foram validados (cada viagem é estritamente crescente ao longo do percurso; testes em `src/utils/planner.test.ts`) e conferidos com a API pública de tracking (mesmas paragens, ordem e horas).

```
src/data/stops.ts       paragens (nome/detalhe + coordenadas aproximadas)
src/data/schedules.ts   horários por linha  (stops[i].times[j] = viagem j)
src/data/lines.ts       metadados das linhas (cores, resumo)
src/data/service.ts     estado do serviço – substituir fetchServiceStatus() por uma API real
```

## Ambiguidades / limites (assinalados no código)

- **Coordenadas.** As posições do mapa vêm das paragens da API de tracking do TUPR (© Eleven Systems), validada contra os horários (mesmas paragens, ordem e horas) por `scripts/apply_api_coords.py`; esse script também recalcula o traçado sobre a rede viária (OSRM). Paragens partilhadas por duas linhas usam o ponto médio das duas posições.
- Os horários publicados **não indicam o lado da via**: paragens com o mesmo nome *e* a mesma indicação nas duas linhas foram unificadas; as restantes ficam separadas.
- Os horários publicados **não referem domingos nem feriados**: a app assume que não há serviço ao domingo e avisa o utilizador; feriados não são tratados.
- Transbordos: máx. 1, em paragem partilhada, com folga mínima de 2 min (valor da app).
- Fim do circuito: a hora na última paragem é chegada; a viagem seguinte é tratada como independente.

## Notas técnicas

- Mapa: tiles `tile.openstreetmap.org` com atribuição visível, carregados só quando necessário (lazy).
- Localização: opcional, só em memória, nunca enviada nem guardada. Favoritos: `localStorage`.
- Modo claro por omissão; escuro por escolha do utilizador. URLs limpos (`/horarios`, `/linhas/verde`, `/paragens/estacao`; inglês em `/en/...`): o idioma vem do endereço.

## Idiomas e animações

- **PT / EN**: dicionários em `src/i18n/pt.ts` e `src/i18n/en.ts` (o TypeScript falha o build se faltar uma chave). Idioma inicial = o do browser; a escolha fica em `localStorage`. Os nomes das paragens ficam como nos horários publicados (em português).
- **Transições**: tema (círculo que se expande) e idioma (fusão) usam a View Transitions API, com *fallback* sem animação; as páginas entram suavemente e as secções da homepage revelam-se ao fazer scroll.
- **Abertura**: um autocarro TUPR atravessa o ecrã e vai revelando a página (uma vez por sessão; toque/Esc para saltar). Desativa-se com “reduzir movimento”.

## Autocarros em tempo real

Posições obtidas da API pública do sistema de tracking do TUPR (<https://tracking.elevensystems.pt/tupr>, © Eleven Systems):
`GET https://tupr.elevensystems.pt/api/locations?passengerInfo=true&routeId=1|2` (1 = Verde, 2 = Vermelha). Código em `src/services/tracking.ts` e `src/hooks/useBuses.ts`.

- Só consulta a API (a cada 10 s) enquanto houver um mapa/painel de autocarros no ecrã e o separador estiver visível.
- Se a API falhar, mantém a última posição conhecida e avisa; o resto da app não é afetado.
- O único estado documentado no site de tracking é `ontime`; qualquer outro valor é mostrado tal como vem.
- Privacidade: o browser do utilizador contacta `tupr.elevensystems.pt` diretamente (essa entidade vê o IP). Convém confirmar com a Eleven Systems que a utilização por terceiros é aceite.

## SEO e build

`npm run build` faz: verificação de tipos → build do Vite → `scripts/prerender.mjs`, que gera um HTML por página (70 páginas × 2 idiomas) com título, descrição, canónico, `hreflang`, Open Graph, dados estruturados (BusStop, BreadcrumbList, WebSite) e o conteúdo real; mais `sitemap.xml`, `robots.txt` e `404.html`. O React substitui o conteúdo pré-gerado ao arrancar.

Variáveis de ambiente do build:

| Variável | Para quê |
|---|---|
| `SITE_URL` | Endereço público sem barra final (ex.: `https://horariostupr.pt`). Na Vercel usa `VERCEL_PROJECT_PRODUCTION_URL` só se for um domínio próprio (não `*.vercel.app`). Sem endereço, o build é `noindex`. |
| `NOINDEX=1` | Não indexar (meta `noindex` e `robots.txt` a bloquear). Usado no GitHub Pages para não duplicar o site principal. |
| `BASE` | Subpasta de alojamento (GitHub Pages: `/TUPR-WebApp/`). Em domínio próprio fica `/`. |

`vercel.json` ativa `cleanUrls` (serve `/horarios` a partir de `horarios.html`) e reencaminha endereços desconhecidos para a app.

## Licença

Todos os direitos reservados © Bagatela (ver `LICENSE`). Os horários, o tarifário e a posição dos autocarros são de terceiros; o mapa é © OpenStreetMap.
