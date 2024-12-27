
import Navbar from "@/components/nav-bar";
import { UserProfileInitializer } from "./components/UserProfileInitializer";
// import { TaskListInitializer } from "./components/TaskListInitializer";
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
          <UserProfileInitializer />
          {/* <TaskListInitializer/> */}
          <div className="h-[68px]">
            <Navbar/>
          </div>
          {children}
    </div>
  );
}

