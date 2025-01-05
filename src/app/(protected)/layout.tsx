
import Navbar from "@/components/nav-bar";
import { UserProfileInitializer } from "./components/UserProfileInitializer";
import { NavbarProvider } from '@/contexts/NavbarContext'
import Overlay from "./components/Overlay";

// import { TaskListInitializer } from "./components/TaskListInitializer";
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <NavbarProvider>
      <div className="min-h-screen flex flex-col">
        <UserProfileInitializer />
        {/* <TaskListInitializer/> */}
        <div className="h-[68px]">
          <Navbar/>
        </div>
        <Overlay />
        {children}
      </div>
    </NavbarProvider>
  );
}

