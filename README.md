# TUPR – Transportes Urbanos do Peso da Régua

Webapp (React + Vite + TypeScript + Tailwind + Leaflet) para consultar horários, planear viagens e ver as próximas partidas do TUPR.

> **Projeto isolado da Bagatela.** Os horários são informação pública e podem estar desatualizados.

```bash
npm install
npm run dev      # desenvolvimento
npm test         # integridade dos dados + planeador
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
- Modo claro por omissão; escuro por escolha do utilizador. Rotas com `HashRouter` (funciona em qualquer alojamento estático).

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
