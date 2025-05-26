'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react'

type SettingsCtx = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const SettingsContext = createContext<SettingsCtx>({
  isOpen: false,
  open:    () => {},
  close:   () => {},
  toggle:  () => {},
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const ctx = {
    isOpen,
    open:   () => setIsOpen(true),
    close:  () => setIsOpen(false),
    toggle: () => setIsOpen((o) => !o),
  }
  return (
    <SettingsContext.Provider value={ctx}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
