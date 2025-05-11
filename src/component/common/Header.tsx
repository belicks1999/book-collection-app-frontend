import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Header = ({ user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full mr-2 bg-blue-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 md:h-8 md:w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="flex-shrink-0">
              <h1 className="text-lg md:text-xl font-bold text-blue-600">
                BookManager
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-10 md:flex md:space-x-4">
            <a
              href="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Dashboard
            </a>
            <a
              href="/books"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Books
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Profile dropdown - Desktop */}
          <div className="hidden md:ml-4 md:flex md:items-center">
            <div className="relative ml-3" ref={dropdownRef}>
              <button
                className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="ml-2 text-gray-700">
                  {user?.name || "User"}
                </span>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </a>

                  <button
                    onClick={onLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Dashboard
            </a>
            <a
              href="/books"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Books
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.name || "User"}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user?.email || ""}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <a
                href="/profile"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
              >
                <User className="mr-3 h-5 w-5 text-gray-500" />
                Profile
              </a>
              <button
                onClick={onLogout}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
