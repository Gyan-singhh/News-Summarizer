import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/api";
import Logo from "./Logo.jsx";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const { user, loading, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const data = await logout();
      console.log("Logout success:", data);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

return (
  <nav className="bg-gray-800 border-b border-gray-700">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <Logo h={9} w={9} />

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg transition-colors ${
              location.pathname === "/" ? "bg-green-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`px-3 py-2 rounded-lg transition-colors ${
              location.pathname === "/about" ? "bg-green-600 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            About
          </Link>
          {!loading && user && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors text-white"
              >
                Logout
              </button>
            </div>
          )}
          {!loading && !user && (
            <Link
              to="/auth"
              className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors text-white"
            >
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          {user && (
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-700">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 text-gray-300 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 text-gray-300 hover:text-white"
            >
              About
            </Link>
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="px-3 py-2 text-red-400 hover:text-red-300 text-left"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  </nav>
);
}

export default Navbar;