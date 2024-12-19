
import { UserProfileInitializer } from "./components/UserProfileInitializer";
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
          <UserProfileInitializer />
          {children}
    </div>
  );
}

