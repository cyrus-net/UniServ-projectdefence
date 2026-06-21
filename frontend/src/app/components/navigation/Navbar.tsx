import { Link, NavLink, useNavigate } from "react-router";
import { Bell, Menu, X, LogOut, MessageSquare, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

interface NavbarProps {
  userRole?: "client" | "seller" | null;
}

export function Navbar({ userRole = null }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  const getNavLinks = () => {
    if (userRole === "client") {
      return [
        { label: "Home", path: "/client/dashboard" },
        { label: "Explore", path: "/client/explore" },
        { label: "My Bookings", path: "/client/bookings" },
      ];
    } else if (userRole === "seller") {
      return [
        { label: "Dashboard", path: "/seller/dashboard" },
        { label: "My Services", path: "/seller/services" },
        { label: "Earnings", path: "/seller/earnings" },
        { label: "Bookings", path: "/seller/bookings" },
      ];
    }
    return [
      { label: "Home", path: "/" },
      { label: "How It Works", path: "/how-it-works" },
      { label: "About", path: "/about" },
    ];
  };

  const getProfilePath = () => {
    if (userRole === "client") return "/client/profile";
    if (userRole === "seller") return "/seller/profile";
    return "/profile";
  };

  const navLinks = getNavLinks();
  const profilePath = getProfilePath();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={
              userRole === "client"
                ? "/client/dashboard"
                : userRole === "seller"
                ? "/seller/dashboard"
                : "/"
            }
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">U</span>
            </div>
            <span className="text-xl font-semibold text-foreground">UniServ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-foreground/70 hover:text-foreground transition-colors ${
                    isActive ? "text-primary font-semibold border-b-2 border-primary pb-1" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {userRole ? (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-foreground/70" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </Link>
                <Link
                  to="/messages"
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-foreground/70" />
                </Link>
                <Link
                  to={profilePath}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5 text-foreground/70" />
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  title="Logout"
                  className="p-2 hover:bg-accent rounded-lg transition-colors text-foreground/70 hover:text-foreground"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-accent text-foreground font-semibold" : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-border space-y-2">
              {userRole ? (
                <>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Notifications
                  </Link>
                  <Link
                    to={profilePath}
                    className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowLogoutConfirm(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="block px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 border border-border max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Do you want to log out?</h2>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}