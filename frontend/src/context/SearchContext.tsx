'use client'

import React, {createContext, useContext, useState, ReactNode} from 'react'
import { SearchCommand } from '../pages/app/Main/LeftSideBar/Search-command'

interface SearchCtx {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: boolean
}

const SearchContext = createContext<SearchCtx>({
  open: () => {},
  close: () => {},
  toggle: () => {},
  isOpen: false,
})

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const ctx = {
    open:    () => setIsOpen(true),
    close:   () => setIsOpen(false),
    toggle:  () => setIsOpen(o => !o),
    isOpen,
  }
  return (
    <SearchContext.Provider value={ctx}>
      {children}
      <SearchCommand open={isOpen} onOpenChange={setIsOpen} />
    </SearchContext.Provider>
  )
}

export const useSearchCtx = () => useContext(SearchContext)
