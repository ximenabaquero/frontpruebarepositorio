"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import Cookies from "js-cookie";

type User = { id: number; name: string; email: string };

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkSession() {
    try {
      const res = await fetch("/backend/api/v1/me", {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data?.id ? data : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      const token = Cookies.get("XSRF-TOKEN") ?? "";

      await fetch("/backend/api/v1/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null); // limpiar contexto
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, checkSession, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
