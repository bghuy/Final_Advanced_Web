'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, Eye, EyeOff } from 'lucide-react'
import { changePassword } from '@/services/auth'
import { logOut } from '../../../../../actions/logout'
import { useRouter } from 'next/navigation'

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    // Implement password change logic here
    try {
      setLoading(true)
      await changePassword(newPassword, currentPassword)
      const result = await logOut()
      if (result.redirectTo) {
        router.push(result.redirectTo)
      } else {
        console.error(result.message || "Unknown error during logout")
      }
      setSuccess(true)
    } catch (error) {
      console.log(error);
      setError('Failed to change password. Please try again.')
    } finally{
      setLoading(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto pt-6">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-100 border-green-500">
              <AlertDescription className="text-green-700">
                Password changed successfully!
              </AlertDescription>
            </Alert>
          )}
          <Button disabled = {loading} type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

