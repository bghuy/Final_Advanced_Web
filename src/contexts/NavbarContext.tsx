'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface NavbarContextType {
  isDisabled: boolean
  setIsDisabled: (value: boolean) => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [isDisabled, setIsDisabled] = useState(false)

  return (
    <NavbarContext.Provider value={{ isDisabled, setIsDisabled }}>
      {children}
    </NavbarContext.Provider>
  )
}

export function useNavbar() {
  const context = useContext(NavbarContext)
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider')
  }
  return context
}

