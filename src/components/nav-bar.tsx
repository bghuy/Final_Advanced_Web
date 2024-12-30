'use client'

import { useState } from 'react'
import Link from 'next/link'
import {User, LogOut, BarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import type { RootState } from './../../redux/store'
import { logOut } from '../../actions/logout'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const user = useSelector((state: RootState) => state.user)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async() => {
    const result = await logOut()
    if (result.redirectTo) {
      router.push(result.redirectTo)
    } else {
      console.error(result.message || "Unknown error during logout")
    }
  }

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="text-white flex items-center space-x-6">
        <Link className='text-2xl font-bold hover:text-blue-200 transition-colors duration-200' href="/tasks">
          MyApp
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link 
            href="/analyze-schedule" 
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200"
          >
            <BarChart className="h-5 w-5" />
            <span>Analyze with AI</span>
          </Link>
        </div>
      </div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="User menu" className="text-black hover:bg-white/10 transition-colors duration-200">
            <Avatar>
              {/* <AvatarImage src={user?.avatarUrl} alt={user?.username} /> */}
              <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
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
          <DropdownMenuItem onSelect={handleLogout} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

