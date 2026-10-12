import { useEffect } from 'react'
import { createStore } from './store'

export type Theme = 'light' | 'dark'
// O modo principal é o claro; só passa a escuro por escolha explícita do utilizador.
const store = createStore<Theme>('light', { key: 'tupr:theme', parse: (r) => (r === 'dark' ? 'dark' : 'light') })

export function useTheme() {
  const theme = store.use()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1a26' : '#143c57')
  }, [theme])
  return { theme, toggle: () => store.set((t) => (t === 'dark' ? 'light' : 'dark')) }
}
