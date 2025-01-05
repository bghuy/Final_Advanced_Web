'use client'

import { useNavbar } from '@/contexts/NavbarContext'

export default function Overlay() {
  const { isDisabled } = useNavbar()
  if (!isDisabled) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 h-[72px]" />
  )
}

