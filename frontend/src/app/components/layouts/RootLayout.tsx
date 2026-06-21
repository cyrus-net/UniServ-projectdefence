import { Outlet, useLocation } from "react-router";
import { Navbar } from "../navigation/Navbar";
import { useAuth } from "../../context/AuthContext";

export function RootLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const shouldShowPublicNavbar = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole={shouldShowPublicNavbar ? null : user?.role} />
      <Outlet />
    </div>
  );
}
