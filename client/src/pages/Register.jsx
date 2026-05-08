import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUserPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { AuthFrame } from "./Login";

export default function Register() {
  const { register } = useAuth();
  const [values, setValues] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(values);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Create account" subtitle="Start your profile and join the sphere.">
      <form onSubmit={submit} className="space-y-4">
        <input className="input" placeholder="Full name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
        <input className="input" placeholder="Username" value={values.username} onChange={(e) => setValues({ ...values, username: e.target.value })} />
        <input className="input" type="email" placeholder="Email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
        <button className="btn-primary w-full" disabled={loading}>
          <FiUserPlus /> {loading ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        Already registered? <Link className="font-bold text-sphere-sky" to="/login">Login</Link>
      </p>
    </AuthFrame>
  );
}
