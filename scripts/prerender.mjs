/**
 * Pós-build: gera um HTML por página (PT na raiz, EN em /en) com título, descrição, canónico, hreflang,
 * Open Graph, dados estruturados e o conteúdo real dentro de #root (o React substitui-o ao arrancar),
 * mais sitemap.xml, robots.txt e 404.html.
 *
 * Variáveis de ambiente:
 *   SITE_URL   endereço público (sem barra final). Em Vercel usa VERCEL_PROJECT_PRODUCTION_URL se for um domínio próprio (não *.vercel.app); sem endereço o build é noindex.
 *   NOINDEX=1  para builds que não devem ser indexados (ex.: GitHub Pages): meta noindex e robots.txt a bloquear.
 *   BASE       subpasta de alojamento (o mesmo valor usado no build do Vite).
 */
import { createServer } from 'vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
// Sem endereço público conhecido não há canónico nem sitemap fiáveis: o build fica NOINDEX (nunca se aponta para um domínio por adivinhar).
// Endereço provisório da Vercel (*.vercel.app) não conta: só se indexa num domínio próprio.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL && !/\.vercel\.app$/.test(process.env.VERCEL_PROJECT_PRODUCTION_URL) ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : ''
const SITE = (process.env.SITE_URL || vercelHost).replace(/\/$/, '')
const NOINDEX = process.env.NOINDEX === '1' || !SITE
if (!SITE && process.env.NOINDEX !== '1') console.warn('prerender: SITE_URL não definido — a gerar sem indexação (noindex).')

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

const vite = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const load = (p) => vite.ssrLoadModule(p)
const [i18n, routing, seoMod, linesMod, netMod, stopsMod, tariffsMod, legalMod, utilMod, timeMod] = await Promise.all([
  load('/src/i18n/index.ts'), load('/src/i18n/routing.ts'), load('/src/utils/seo.ts'), load('/src/data/lines.ts'),
  load('/src/data/network.ts'), load('/src/data/stops.ts'), load('/src/data/tariffs.ts'), load('/src/i18n/legal.ts'),
  load('/src/utils/service.ts'), load('/src/utils/time.ts'),
])
const { setLang, translate } = i18n
const { urlFor, BASE } = routing
const { seoFor, allPaths } = seoMod
const { lines } = linesMod
const { stopById, passingsOf, linesAtStop } = netMod
const { stops } = stopsMod
const { tariffs } = tariffsMod
const { terms, privacy } = legalMod
const { tripRunsOn } = utilMod
void timeMod

const template = await readFile(join(DIST, 'index.html'), 'utf8')
const LANGS = ['pt', 'en']
const LOCALE = { pt: 'pt_PT', en: 'en_GB' }
const HTML_LANG = { pt: 'pt-PT', en: 'en' }

const abs = (lang, path) => SITE + urlFor(lang, path)
const link = (lang, path, label) => `<a href="${esc(urlFor(lang, path))}">${esc(label)}</a>`
const stopLabel = (s) => (s.detail ? `${s.name} (${s.detail})` : s.name)

function nav(lang) {
  const t = (k) => translate(lang, k)
  const items = [['/planear', t('nav.plan')], ['/proximos', t('nav.next')], ['/horarios', t('nav.timetables')], ['/linhas', t('nav.lines')], ['/paragens', t('nav.stops')], ['/mapa', t('nav.map')], ['/termos', t('footer.terms')], ['/privacidade', t('footer.privacy')]]
  return `<nav aria-label="${esc(t('nav.main'))}"><ul>${items.map(([p, l]) => `<li>${link(lang, p, l)}</li>`).join('')}</ul></nav>`
}

function legalBody(doc) {
  return `<h1>${esc(doc.title)}</h1><p>${esc(doc.intro)}</p><p><small>${esc(doc.updated)}</small></p>` +
    doc.sections.map((s) => `<h2>${esc(s.h)}</h2>${(s.p ?? []).map((p) => `<p>${esc(p)}</p>`).join('')}${s.ul ? `<ul>${s.ul.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}`).join('')
}

function stopTimesText(stopId, lang) {
  const t = (k, p) => translate(lang, k, p)
  return passingsOf(stopId).map(({ line, index }) => {
    const arrivalOnly = index === line.stops.length - 1
    const all = line.trips.map((trip, j) => ({ trip, time: line.stops[index].times[j] }))
    const everyDay = all.filter((x) => x.trip.days === 'mon-sat').map((x) => x.time)
    const weekdays = all.filter((x) => x.trip.days === 'mon-fri').map((x) => x.time)
    return `<h2>${link(lang, `/linhas/${line.id}`, line.name)}</h2>` +
      (arrivalOnly ? `<p>${esc(t('tt.endCircuit'))}</p>` : '') +
      `<p>${esc(lang === 'pt' ? 'Segunda a sábado' : 'Monday to Saturday')}: ${esc(everyDay.join(', '))}</p>` +
      (weekdays.length ? `<p>${esc(lang === 'pt' ? 'Apenas segunda a sexta' : 'Monday to Friday only')}: ${esc(weekdays.join(', '))}</p>` : '')
  }).join('')
}

function body(lang, path) {
  const t = (k, p) => translate(lang, k, p)
  const info = seoFor(path, lang)
  const head = (h1) => `<h1>${esc(h1)}</h1><p>${esc(info.description)}</p>`
  if (path === '/') {
    return `<h1>${esc(t('home.title1'))} ${esc(t('home.title2'))}</h1><p>${esc(t('home.subtitle'))}</p>${nav(lang)}` +
      `<h2>${esc(t('nav.lines'))}</h2><ul>${lines.map((l) => `<li>${link(lang, `/linhas/${l.id}`, l.name)}: ${esc(l.summary)}</li>`).join('')}</ul>` +
      `<h2>${esc(t('info.hoursTitle'))}</h2><ul><li>${esc(t('info.hours1'))}</li><li>${esc(t('info.hours2'))}</li><li>${esc(t('info.hours3'))}</li></ul>` +
      `<h2>${esc(t('info.fares'))}</h2><ul>${tariffs.map((x) => `<li>${esc(t(x.label))}: ${esc(x.free ? t('tariff.free') : x.price)}</li>`).join('')}</ul>` +
      `<p>${esc(t('footer.independent'))}</p><p>${esc(t('footer.source'))}</p>`
  }
  if (path === '/termos') return legalBody(terms[lang]) + nav(lang)
  if (path === '/privacidade') return legalBody(privacy[lang]) + nav(lang)
  if (path === '/planear' || path === '/proximos' || path === '/mapa') return head(info.title.replace(t('seo.suffix'), '')) + nav(lang)
  if (path === '/horarios') {
    return head(t('nav.timetables')) + nav(lang) + lines.map((l) => `<h2>${esc(l.name)}</h2><table><thead><tr><th>${esc(t('stop.one'))}</th>${l.trips.map((tr) => `<th>${tr.departure}</th>`).join('')}</tr></thead><tbody>${l.stops.map((s) => `<tr><th>${esc(stopLabel(stopById.get(s.stopId)))}</th>${s.times.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`).join('') + `<p>${esc(t('tt.footnote'))}</p>`
  }
  if (path === '/linhas') return head(t('nav.lines')) + nav(lang) + `<ul>${lines.map((l) => `<li>${link(lang, `/linhas/${l.id}`, l.name)}: ${esc(l.summary)}</li>`).join('')}</ul>`
  if (path === '/paragens') return head(t('nav.stops')) + nav(lang) + `<ul>${[...stops].sort((a, b) => a.name.localeCompare(b.name, 'pt')).map((s) => `<li>${link(lang, `/paragens/${s.id}`, stopLabel(s))}</li>`).join('')}</ul>`
  const lm = /^\/linhas\/([\w-]+)$/.exec(path)
  if (lm) {
    const l = lines.find((x) => x.id === lm[1])
    return head(l.name) + nav(lang) + `<p>${esc(l.trips.map((x) => x.departure).join(', '))}</p><ol>${l.stops.map((s, i) => `<li>${esc(s.times[0])} ${link(lang, `/paragens/${s.stopId}`, stopLabel(stopById.get(s.stopId)))}</li>`).join('')}</ol><p>${esc(t('sat.note'))}</p>`
  }
  const sm = /^\/paragens\/([\w-]+)$/.exec(path)
  if (sm) {
    const s = stopById.get(sm[1])
    return `<h1>${esc(s.name)}</h1>${s.detail ? `<p>${esc(s.detail)}</p>` : ''}<p>${esc(info.description)}</p>` + stopTimesText(s.id, lang) + `<p>${esc(t('sat.note'))}</p>` + nav(lang)
  }
  return `<h1>${esc(info.title)}</h1>`
}

function jsonLd(lang, path) {
  const out = []
  const t = (k, p) => translate(lang, k, p)
  const crumbs = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(lang, p) })) })
  if (path === '/') {
    out.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Réguamove', url: abs(lang, '/'), inLanguage: HTML_LANG[lang], description: seoFor('/', lang).description, publisher: { '@type': 'Organization', name: 'Bagatela', url: 'https://abagatela.pt' } })
  }
  const lm = /^\/linhas\/([\w-]+)$/.exec(path)
  if (lm) out.push(crumbs([[t('nav.home'), '/'], [t('nav.lines'), '/linhas'], [lines.find((l) => l.id === lm[1]).name, path]]))
  const sm = /^\/paragens\/([\w-]+)$/.exec(path)
  if (sm) {
    const s = stopById.get(sm[1])
    out.push(crumbs([[t('nav.home'), '/'], [t('nav.stops'), '/paragens'], [s.name, path]]))
    out.push({ '@context': 'https://schema.org', '@type': 'BusStop', name: stopLabel(s), url: abs(lang, path), ...(s.coords ? { geo: { '@type': 'GeoCoordinates', latitude: s.coords[0], longitude: s.coords[1] } } : {}), containedInPlace: { '@type': 'City', name: 'Peso da Régua' } })
  }
  return out
}

function page(lang, path) {
  const info = seoFor(path, lang)
  const other = lang === 'pt' ? 'en' : 'pt'
  const img = `${SITE}${BASE}/og-image.png`
  const tags = [
    `<title>${esc(info.title)}</title>`,
    `<meta name="description" content="${esc(info.description)}" />`,
    NOINDEX || info.noindex ? '<meta name="robots" content="noindex" />' : '',
    NOINDEX ? '' : `<link rel="canonical" href="${esc(abs(lang, path))}" />`,
    NOINDEX ? '' : `<link rel="alternate" hreflang="pt-PT" href="${esc(abs('pt', path))}" />`,
    NOINDEX ? '' : `<link rel="alternate" hreflang="en" href="${esc(abs('en', path))}" />`,
    NOINDEX ? '' : `<link rel="alternate" hreflang="x-default" href="${esc(abs('pt', path))}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Réguamove" />',
    `<meta property="og:title" content="${esc(info.title)}" />`,
    `<meta property="og:description" content="${esc(info.description)}" />`,
    `<meta property="og:url" content="${esc(abs(lang, path))}" />`,
    `<meta property="og:locale" content="${LOCALE[lang]}" />`,
    `<meta property="og:locale:alternate" content="${LOCALE[other]}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="Réguamove – ${esc(translate(lang, 'brand.sub'))}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(info.title)}" />`,
    `<meta name="twitter:description" content="${esc(info.description)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
    ...jsonLd(lang, path).map((o) => `<script type="application/ld+json">${json(o)}</script>`),
  ].filter(Boolean).join('\n    ')
  let html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${HTML_LANG[lang]}"`)
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('</head>', `    ${tags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><div class="seo-shell">${body(lang, path)}</div></div>`)
  return html
}

const written = []
for (const lang of LANGS) {
  setLang(lang)
  for (const path of allPaths()) {
    // /horarios -> horarios.html (servido sem extensão: Vercel com cleanUrls, GitHub Pages e a maioria dos alojamentos)
    const rel = (lang === 'en' ? '/en' : '') + (path === '/' ? '' : path)
    const file = join(DIST, rel === '' ? 'index.html' : `${rel}.html`)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, page(lang, path))
    written.push([lang, path])
  }
}
setLang('pt')

// sitemap (com alternativas de idioma) e robots
if (!NOINDEX) {
  const urls = allPaths().map((p) => {
    const alt = (l, rel) => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(abs(rel, p))}"/>`
    return LANGS.map((lang) => `  <url><loc>${esc(abs(lang, p))}</loc>${alt('pt-PT', 'pt')}${alt('en', 'en')}${alt('x-default', 'pt')}</url>`).join('\n')
  }).join('\n')
  await writeFile(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`)
  await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}${BASE}/sitemap.xml\n`)
} else {
  await writeFile(join(DIST, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
}
// 404.html: alojamentos estáticos (GitHub Pages) usam-no como "fallback" da aplicação
await writeFile(join(DIST, '404.html'), template)

// service worker: cada build renova a cache
const sw = await readFile(join(DIST, 'sw.js'), 'utf8')
await writeFile(join(DIST, 'sw.js'), sw.replaceAll('__BUILD_ID__', Date.now().toString(36)))

await vite.close()
console.log(`prerender: ${written.length} páginas · site ${SITE}${NOINDEX ? ' · NOINDEX' : ''}`)
