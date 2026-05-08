import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiBell, FiCompass, FiHome, FiLogOut, FiPlusCircle, FiSearch, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

const nav = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/explore", label: "Explore", icon: FiCompass },
  { to: "/create", label: "Create", icon: FiPlusCircle },
  { to: "/notifications", label: "Alerts", icon: FiBell },
  { to: "/search", label: "Search", icon: FiSearch }
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-5 px-3 sm:px-5">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 py-5 lg:block">
        <div className="glass flex h-full flex-col rounded-lg p-4">
          <button onClick={() => navigate("/")} className="mb-8 flex items-center gap-3 text-left">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-sphere-sky to-sphere-mint text-xl font-black text-sphere-ink">CS</span>
            <span>
              <span className="block text-xl font-black">ConnectSphere</span>
              <span className="text-sm text-slate-400">Social dashboard</span>
            </span>
          </button>

          <nav className="space-y-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 font-semibold transition ${
                    isActive ? "bg-white/12 text-sphere-sky" : "text-slate-300 hover:bg-white/7"
                  }`
                }
              >
                <item.icon /> {item.label}
              </NavLink>
            ))}
            <NavLink to={`/profile/${user.username}`} className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-slate-300 transition hover:bg-white/7">
              <FiUser /> Profile
            </NavLink>
          </nav>

          <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <Avatar user={user} />
              <div className="min-w-0">
                <p className="truncate font-bold">{user.name}</p>
                <p className="truncate text-sm text-slate-400">@{user.username}</p>
              </div>
            </div>
            <button onClick={logout} className="btn-ghost mt-4 w-full">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="w-full flex-1 pb-24 pt-4 lg:pb-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Outlet />
        </motion.div>
      </main>

      <nav className="fixed bottom-3 left-1/2 z-50 grid w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 grid-cols-6 rounded-lg border border-white/10 bg-sphere-panel/95 p-2 shadow-2xl backdrop-blur lg:hidden">
        {nav.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `grid place-items-center rounded-lg py-2 text-xl ${isActive ? "text-sphere-sky" : "text-slate-400"}`}>
            <item.icon />
          </NavLink>
        ))}
        <NavLink to={`/profile/${user.username}`} className={({ isActive }) => `grid place-items-center rounded-lg py-2 text-xl ${isActive ? "text-sphere-sky" : "text-slate-400"}`}>
          <FiUser />
        </NavLink>
      </nav>
    </div>
  );
}
