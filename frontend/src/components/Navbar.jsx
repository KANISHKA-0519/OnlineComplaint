import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { theme } from "../utils/theme";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-700 text-white px-6 py-4 flex justify-between items-center">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link to="/public" className="text-lg font-semibold">
          Complaint System
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/public" className="transition hover:text-blue-300">
            Public Dashboard
          </NavLink>
          <NavLink to="/track" className="transition hover:text-blue-300">
            Track Complaint
          </NavLink>

          {user?.role === "citizen" && (
            <NavLink to="/citizen-dashboard" className="transition hover:text-blue-300">
              Citizen Dashboard
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin-dashboard" className="transition hover:text-blue-300">
              Admin Dashboard
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className="transition hover:text-blue-300">
                Login
              </NavLink>
              <NavLink to="/register" className="transition hover:text-blue-300">
                Register
              </NavLink>
            </>
          ) : (
            <button
              type="button"
              onClick={logout}
              className={theme.buttonSecondary}
            >
              Logout ({user?.name})
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
