'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Settings, User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useSelector} from 'react-redux';
import type { RootState } from './../../redux/store';
import { logOut } from '../../actions/logout'
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
const user = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();
  const handleLogout = async() => {
    const result = await logOut();
    if (result.redirectTo) {
        router.push(result.redirectTo); // Chuyển hướng sử dụng router.push
    } else {
        console.error(result.message || "Unknown error during logout");
    }
  }

  return (
    <nav className="flex items-center justify-between bg-sky-500 p-4 shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="text-xl font-bold text-white">
        <Link href="/">MyApp</Link>
      </div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Settings" className="text-white hover:bg-sky-600">
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>{user?.username}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="text-sm text-gray-500">{user?.email}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

