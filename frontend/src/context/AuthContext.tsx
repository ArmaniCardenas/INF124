import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

interface User { username: string, email: string }  

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pwd: string) => Promise<boolean>;
  signup: (data: { email: string; password: string; username: string }) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post("/verify-token", {}, { withCredentials: true })
      .then(res => {
        if (res.data.success) setUser(res.data.user as User);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post("/signin", { email, password }, { withCredentials: true });
      if (data.success) {

        const verify = await axios.post("/verify-token", {}, { withCredentials: true});
        setUser(verify.data.user)
        return true;
      }
    } catch {}
    return false;
  };

  const signup = async (newUser: { email: string; password: string; username: string }) => {
    try {
      const { data } = await axios.post("/signup", newUser, { withCredentials : true });
      if (data.success) {

        const verify = await axios.post("/verify-token", {}, { withCredentials: true });
        setUser(verify.data.user);
        return true;
      }
    } catch {}
    return false;
  };

  const logout = async () => {
    await axios.post("/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("");
  return ctx;
};
