import { useEffect } from 'react'
import { smoothUpdate } from '../utils/transition'
import { createStore } from './store'

export type Theme = 'light' | 'dark'
// O modo principal é o claro; só passa a escuro por escolha explícita do utilizador.
const store = createStore<Theme>('light', { key: 'tupr:theme', parse: (r) => (r === 'dark' ? 'dark' : 'light') })

const apply = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b1a26' : '#143c57')
}

export function useTheme() {
  const theme = store.use()
  useEffect(() => apply(theme), [theme])
  return {
    theme,
    toggle: () => {
      const next: Theme = store.get() === 'dark' ? 'light' : 'dark'
      smoothUpdate(() => {
        store.set(next)
        apply(next)
      })
    },
  }
}
