
import Navbar from "@/components/nav-bar";
import { UserProfileInitializer } from "./components/UserProfileInitializer";
import { TaskListInitializer } from "./components/TaskListInitializer";
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
          <UserProfileInitializer />
          <TaskListInitializer/>
          <Navbar/>
          {children}
    </div>
  );
}

