import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function Navbar() {
  const { token, logout, isAdmin, isDonor } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition ${
      isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="section-shell flex min-h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-lg font-black text-white shadow-lg shadow-emerald-200">
            T
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight text-slate-950">TraceAid</span>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 sm:block">
              Transparent NGO
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/campaigns" className={linkClass}>Campaigns</NavLink>
          {token && isAdmin ? (
            <>
              <NavLink to="/admin" className={linkClass}>Admin Dashboard</NavLink>
              <NavLink to="/donors" className={linkClass}>Donors</NavLink>
              <NavLink to="/inventory" className={linkClass}>Inventory</NavLink>
            </>
          ) : null}
          {token && isDonor ? (
            <>
              <NavLink to="/donor" className={linkClass}>Donor Dashboard</NavLink>
              <NavLink to="/donations" className={linkClass}>Donate</NavLink>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {token ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 sm:inline-flex">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
