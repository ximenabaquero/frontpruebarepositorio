"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Home,
  User,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "/backend";

  const floatStyles = useMemo<CSSProperties[]>(() => {
    const rand = mulberry32(246810);
    return Array.from({ length: 12 }, () => {
      const size = rand() * 100 + 50;
      const left = rand() * 100;
      const top = rand() * 100;
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
      };
    });
  }, []);

  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Paso 1: pedir CSRF cookie
      await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      // Paso 2: leer token
      const token = Cookies.get("XSRF-TOKEN") ?? "";

      // Paso 3: login
      const res = await fetch(`${apiBaseUrl}/api/v1/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(data?.message || "No se pudo iniciar sesión.");
        return;
      }

      // Guardar usuario en contexto global
      setUser(data.user);

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/register-patient";
      router.push(next);
    } catch (error) {
      setErrorMessage("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatStyles.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-300/10"
            style={style}
          />
        ))}
      </div>

      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <Image
                    src="/coldestheticlogo.png"
                    alt="Coldesthetic"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                  Coldesthetic
                </h1>
                <p className="text-xs text-gray-500">
                  Estética Médica Avanzada
                </p>
              </div>
            </Link>

            {/* Volver a inicio */}
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al inicio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - CENTRADO */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
            {/* Gradient accent */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-600 to-emerald-500"></div>

            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 mb-4">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-700">
                    Sistema de Acceso Privado
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Acceso al Sistema
                </h2>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">
                  Ingrese sus credenciales para continuar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                ) : null}

                {/* Email field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <Mail className="w-4 h-4 text-emerald-500" />
                    Correo Electrónico
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      className="relative w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <Lock className="w-4 h-4 text-emerald-500" />
                    Contraseña
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="relative w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Iniciando sesión...</span>
                      </>
                    ) : (
                      <>
                        <User className="w-5 h-5" />
                        <span>Iniciar Sesión</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center">
            {/* Texto + candado */}
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3 text-gray-500" />
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold text-center">
                Acceso Restringido a Personal Autorizado
              </p>
            </div>

            {/* Línea horizontal */}
            <div className="mt-5 w-24 h-[1px] bg-gray-300"></div>
          </div>

          {/* Security notice */}
          <div className="mt-4 px-3 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-100">
            <p className="text-[11px] leading-tight text-gray-500 text-center">
              Este sistema contiene información privada y protegida. El acceso
              no autorizado está estrictamente prohibido y sujeto a acciones
              legales.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center text-[11px] text-gray-400 leading-tight">
            <p>
              © {new Date().getFullYear()} Coldesthetic · Sistema de gestión
            </p>
            <p>Uso autorizado exclusivo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
