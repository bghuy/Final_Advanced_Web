'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChangePassword from "./components/ChangePassword" 
import VerifyEmail from "./components/VerifyEmail" 
import { Lock, Mail } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="h-full py-auto flex flex-col mt-2">
      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col h-full">
        {/* <h1 className="text-4xl font-bold mb-6 text-gray-800 flex items-center">
          <Settings className="mr-2 h-8 w-8 text-blue-600" />
          Settings
        </h1> */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden flex-grow flex">
          <Tabs defaultValue="password" className="flex-grow flex overflow-hidden">
            <TabsList className="flex flex-col space-y-2 bg-gray-100 p-6 w-72 h-full justify-start overflow-y-auto border-r border-gray-200">
              <TabsTrigger 
                value="password" 
                className="w-full py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-md justify-start flex items-center"
              >
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </TabsTrigger>
              <TabsTrigger 
                value="email" 
                className="w-full py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ease-in-out data-[state=active]:bg-white data-[state=active]:shadow-md justify-start flex items-center"
              >
                <Mail className="mr-2 h-4 w-4" />
                Verify Email
              </TabsTrigger>
            </TabsList>
            <div className="flex-grow p-8 overflow-y-auto h-[500px] py-auto">
              <TabsContent value="password" className="items-center">
                {/* <h2 className="text-2xl font-semibold mb-6 text-gray-700">Change Password</h2> */}
                <ChangePassword />
              </TabsContent>
              <TabsContent value="email" className="items-center">
                {/* <h2 className="text-2xl font-semibold mb-6 text-gray-700">Verify Email</h2> */}
                <VerifyEmail />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

