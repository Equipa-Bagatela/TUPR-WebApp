// Pequenas peças que o jsdom não traz e a app usa (só em testes de interface)
if (typeof window !== 'undefined') {
  window.matchMedia ??= ((q: string) => ({ matches: false, media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false })) as typeof window.matchMedia
  window.scrollTo = () => {}
  Element.prototype.scrollIntoView = () => {}
}
