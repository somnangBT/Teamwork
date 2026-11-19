import { ref } from 'vue'

function resolveInitialTheme() {
  try {
    const appearance = JSON.parse(localStorage.getItem('app-Appearance') || '{}')
    const saved =
      localStorage.getItem('salon_theme') ||
      appearance.theme ||
      localStorage.getItem('app-theme')
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
  } catch {
    // Ignore storage errors
  }
  return 'light'
}

const currentTheme = ref(resolveInitialTheme())
const isDarkMode = ref(currentTheme.value === 'dark')

function syncDom(themeValue) {
  if (typeof document === 'undefined') return
  const dark = themeValue === 'dark'
  isDarkMode.value = dark
  currentTheme.value = themeValue
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('dark-theme')
  } else {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark-theme')
  }
}

function persistTheme(themeValue) {
  try {
    localStorage.setItem('salon_theme', themeValue)
    localStorage.setItem('app-theme', themeValue)
    const appearance = JSON.parse(localStorage.getItem('app-Appearance') || '{}')
    appearance.theme = themeValue
    localStorage.setItem('app-Appearance', JSON.stringify(appearance))
  } catch {
    // Ignore storage errors
  }
}

syncDom(currentTheme.value)

if (typeof window !== 'undefined') {
  window.addEventListener('theme-changed', () => {
    syncDom(resolveInitialTheme())
  })
  window.addEventListener('storage', (e) => {
    if (e.key === 'salon_theme' || e.key === 'app-theme' || e.key === 'app-Appearance') {
      syncDom(resolveInitialTheme())
    }
  })
}

export function useTheme() {
  const applyTheme = (dark) => {
    const next = dark ? 'dark' : 'light'
    syncDom(next)
    persistTheme(next)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('theme-changed'))
    }
  }

  const toggleTheme = (mode) => {
    if (mode === 'dark' || mode === 'light') {
      applyTheme(mode === 'dark')
    } else {
      applyTheme(!isDarkMode.value)
    }
  }

  return {
    theme: currentTheme,
    isDarkMode,
    toggleTheme,
    applyTheme
  }
}
