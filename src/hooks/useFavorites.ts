import { stopById } from '../data/network'
import { createStore } from './store'

export interface FavoriteRoute {
  from: string
  to: string
}
interface Favs {
  stops: string[]
  routes: FavoriteRoute[]
}
const empty: Favs = { stops: [], routes: [] }
const store = createStore<Favs>(empty, {
  key: 'tupr:favorites',
  parse: (raw) => {
    const r = raw as Partial<Favs>
    return {
      stops: Array.isArray(r.stops) ? r.stops.filter((id) => stopById.has(id)) : [],
      routes: Array.isArray(r.routes) ? r.routes.filter((x) => x && stopById.has(x.from) && stopById.has(x.to)) : [],
    }
  },
})
const same = (a: FavoriteRoute, b: FavoriteRoute) => a.from === b.from && a.to === b.to

export function useFavorites() {
  const favs = store.use()
  return {
    stops: favs.stops,
    routes: favs.routes,
    isStopFav: (id: string) => favs.stops.includes(id),
    isRouteFav: (r: FavoriteRoute) => favs.routes.some((x) => same(x, r)),
    toggleStop: (id: string) =>
      store.set((s) => ({ ...s, stops: s.stops.includes(id) ? s.stops.filter((x) => x !== id) : [...s.stops, id] })),
    toggleRoute: (r: FavoriteRoute) =>
      store.set((s) => ({ ...s, routes: s.routes.some((x) => same(x, r)) ? s.routes.filter((x) => !same(x, r)) : [...s.routes, r] })),
  }
}
