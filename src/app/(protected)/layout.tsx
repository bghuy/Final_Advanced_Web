
import Navbar from "@/components/nav-bar";
import { UserProfileInitializer } from "./components/UserProfileInitializer";
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
          <UserProfileInitializer />
          <Navbar/>
          {children}
    </div>
  );
}

