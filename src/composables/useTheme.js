import { ref } from 'vue'

const isDarkMode = ref(localStorage.getItem('salon_theme') === 'dark')

export function useTheme() {
  const applyTheme = (dark) => {
    isDarkMode.value = dark
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.documentElement.classList.add('dark-theme')
      localStorage.setItem('salon_theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      document.documentElement.classList.remove('dark-theme')
      localStorage.setItem('salon_theme', 'light')
    }
  }

  const toggleTheme = (mode) => {
    if (mode !== undefined) {
      applyTheme(mode === 'dark')
    } else {
      applyTheme(!isDarkMode.value)
    }
  }

  // Initialize on import
  if (isDarkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('dark-theme')
  }

  return { isDarkMode, toggleTheme }
}
