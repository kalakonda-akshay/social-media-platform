import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [values, setValues] = useState({ email: "aarav@connectsphere.dev", password: "password123" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(values);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Welcome back" subtitle="Sign in to your ConnectSphere dashboard.">
      <form onSubmit={submit} className="space-y-4">
        <input className="input" type="email" placeholder="Email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
        <button className="btn-primary w-full" disabled={loading}>
          <FiLogIn /> {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        New here? <Link className="font-bold text-sphere-sky" to="/register">Create an account</Link>
      </p>
    </AuthFrame>
  );
}

export function AuthFrame({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
        <section className="glass flex min-h-[420px] flex-col justify-between rounded-lg p-8">
          <div>
            <div className="mb-8 inline-grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-br from-sphere-sky to-sphere-mint text-2xl font-black text-sphere-ink">CS</div>
            <h1 className="max-w-xl text-4xl font-black tracking-normal text-white sm:text-6xl">ConnectSphere</h1>
            <p className="mt-4 max-w-lg text-lg leading-8 text-slate-300">A polished social platform for posts, follows, profiles, comments, media, and real product-ready MERN learning.</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <span className="rounded-lg border border-white/10 bg-white/5 p-3">JWT auth</span>
            <span className="rounded-lg border border-white/10 bg-white/5 p-3">Media posts</span>
            <span className="rounded-lg border border-white/10 bg-white/5 p-3">Social graph</span>
          </div>
        </section>
        <section className="glass rounded-lg p-6 shadow-glow">
          <h2 className="text-3xl font-black">{title}</h2>
          <p className="mb-6 mt-2 text-slate-400">{subtitle}</p>
          {children}
        </section>
      </motion.div>
    </div>
  );
}
