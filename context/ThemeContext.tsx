import React, { createContext, useContext, useState } from 'react'

export type ThemeColors = {
  background: string
  surface: string
  card: string
  header: string
  text: string
  textMuted: string
  accent: string
  border: string
  tabBar: string
  input: string
  inputBorder: string
  danger: string
}

export const darkColors: ThemeColors = {
  background: '#10102a',
  surface: '#1a1a2e',
  card: '#1c2340',
  header: '#0d0d1a',
  text: '#f0f0f5',
  textMuted: '#b0bcd4',
  accent: '#00d4ff',
  border: 'rgba(0,212,255,0.18)',
  tabBar: '#0d0d1a',
  input: '#141830',
  inputBorder: 'rgba(0,212,255,0.5)',
  danger: '#ff4757',
}

export const lightColors: ThemeColors = {
  background: '#f0f4f8',
  surface: '#ffffff',
  card: '#ffffff',
  header: '#1a1a2e',
  text: '#1a1a2e',
  textMuted: '#5a6680',
  accent: '#0099bb',
  border: '#dde3ed',
  tabBar: '#1a1a2e',
  input: '#eef1f6',
  inputBorder: '#0099bb',
  danger: '#e53e3e',
}

type ThemeCtx = { isDark: boolean; colors: ThemeColors; toggle: () => void }

const Ctx = createContext<ThemeCtx>({ isDark: true, colors: darkColors, toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)
  return (
    <Ctx.Provider value={{ isDark, colors: isDark ? darkColors : lightColors, toggle: () => setIsDark(v => !v) }}>
      {children}
    </Ctx.Provider>
  )
}

export function useTheme() {
  return useContext(Ctx)
}
