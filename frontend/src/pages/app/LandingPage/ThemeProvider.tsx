// src/pages/app/ThemeProvider.tsx
import React, {createContext, useContext, useEffect, useState} from "react"

type Theme = "light"|"dark"|"system"

interface ThemeContextType {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType|undefined>(undefined)

export const ThemeContexts = createContext<{
  theme: 'light' | 'dark';
  toggle: () => void;
}>({
  theme: 'light',
  toggle: () => {},
});


export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "app-theme",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setThemeState] = useState<Theme>(() =>
    (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = document.documentElement
    // determine whether dark mode should be on
    let isDark: boolean
    if (theme === "system") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    } else {
      isDark = theme === "dark"
    }
    // toggle the `dark` class
    root.classList.toggle("dark", isDark)
    root.classList.toggle("light", !isDark)
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: (t) => setThemeState(t) }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
