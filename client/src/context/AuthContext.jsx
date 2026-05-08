import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("connectsphere_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("connectsphere_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("connectsphere_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("connectsphere_token");
        localStorage.removeItem("connectsphere_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const storeSession = (payload) => {
    localStorage.setItem("connectsphere_token", payload.token);
    localStorage.setItem("connectsphere_user", JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const login = async (values) => {
    const { data } = await api.post("/auth/login", values);
    storeSession(data);
    toast.success(`Welcome back, ${data.user.name}`);
  };

  const register = async (values) => {
    const { data } = await api.post("/auth/register", values);
    storeSession(data);
    toast.success("Your sphere is ready");
  };

  const logout = () => {
    localStorage.removeItem("connectsphere_token");
    localStorage.removeItem("connectsphere_user");
    setUser(null);
    toast.success("Logged out");
  };

  const updateUser = (nextUser) => {
    localStorage.setItem("connectsphere_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, updateUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
