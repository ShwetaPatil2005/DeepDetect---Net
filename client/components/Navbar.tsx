import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isAuthenticated = localStorage.getItem("authToken") !== null;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("analysisHistory");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const isActive = (path: string) => {
    return location.pathname === path
      ? "text-primary font-semibold"
      : "text-foreground hover:text-primary transition-colors";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              DeepDetect
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-sm ${isActive("/")}`}>
              Home
            </Link>
            <a href="#features" className="text-sm text-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#why" className="text-sm text-foreground hover:text-primary transition-colors">
              Why DeepDetect
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    Profile
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={handleLogout}
                  className="bg-primary hover:bg-primary/90"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/"
                className={`text-sm px-4 py-2 rounded-lg ${
                  location.pathname === "/"
                    ? "bg-secondary text-foreground"
                    : "text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <a
                href="#features"
                className="text-sm px-4 py-2 text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a
                href="#why"
                className="text-sm px-4 py-2 text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Why DeepDetect
              </a>
              <div className="border-t border-border pt-3 mt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Profile
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={handleLogout}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
