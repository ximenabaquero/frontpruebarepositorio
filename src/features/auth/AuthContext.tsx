"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "REMITENTE";
  status: "active" | "inactive" | "fired";
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  authChecked: boolean;
  isLoggingOut: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function checkSession() {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      if (!token) {
        setUser(null);
        return;
      }

      const res = await fetch(`${API}/api/v1/me`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        localStorage.removeItem("auth_token");
        setUser(null);
        return;
      }

      const data: User = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  }

  async function logout() {
    try {
      setIsLoggingOut(true);
      const token = localStorage.getItem("auth_token");

      await fetch(`${API}/api/v1/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
      setIsLoggingOut(false);
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkSession, logout, loading, authChecked, isLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
