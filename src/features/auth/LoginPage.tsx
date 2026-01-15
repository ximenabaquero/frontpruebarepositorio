"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles, Heart, User, ArrowRight, Shield, Zap, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "/backend";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setErrorMessage(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { token?: string; message?: string }
        | null;

      if (!res.ok || !data?.token) {
        setErrorMessage(data?.message || "No se pudo iniciar sesión.");
        return;
      }

      try {
        if (formData.rememberMe) {
          window.localStorage.setItem("coldesthetic_admin_token", data.token);
        } else {
          window.sessionStorage.setItem("coldesthetic_admin_token", data.token);
        }
        window.localStorage.setItem("coldesthetic_admin_authed", "1");
      } catch {
        // ignore storage failures
      }

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/register-patient";
      window.location.href = next;
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
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
                <p className="text-xs text-gray-500">Estética Médica Avanzada</p>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Form */}
            <div>
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
                {/* Gradient accent */}
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-600 to-emerald-500"></div>
                
                <div className="p-8 md:p-10">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 mb-4">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-700">
                        Acceso Administrativo
                      </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                      Bienvenido 
                       Alexander
                    </h2>
                    <p className="text-gray-600">
                      Ingresa para gestionar contenido, citas y operaciones internas
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
                      <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
                      <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me & Forgot password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-300 focus:ring-2"
                        />
                        <span className="text-sm text-gray-600">Recordarme</span>
                      </label>
                      <a
                        href="/recuperar-contrasena"
                        className="text-sm font-medium text-emerald-600 hover:text-blue-700 transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
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

                    {/* Divider */}
                    <div className="relative flex items-center justify-center my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative px-4 bg-white">
                        <span className="text-sm text-gray-500">o continúa con</span>
                      </div>
                    </div>

                    {/* Social login options */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className="flex items-center justfify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 group"
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">Facebook</span>
                      </button>
                      
                      <button
                        type="button"
                        className="flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 group"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">Google</span>
                      </button>
                    </div>
                  </form>

                  {/* Footer link */}
                  <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-600 text-sm">
                      ¿No tienes acceso?{" "}
                      <a
                        href="/solicitar-acceso"
                        className="font-semibold text-emerald-600 hover:text-blue-700 transition-colors"
                      >
                        Solicita autorización aquí
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Security notice */}
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Acceso seguro</p>
                    <p className="text-xs text-gray-600">
                      Este panel es solo para personal autorizado. Protegemos el acceso con buenas prácticas de seguridad.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Info/Graphics */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl p-8 md:p-10 text-white overflow-hidden relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      Panel Administrativo
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold mb-6">
                    Gestiona la <br />
                    <span className="text-emerald-100">operación interna</span>
                  </h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Gestión de Pacientes</h4>
                        <p className="text-emerald-100/90">
                          Administra registros, seguimiento y atención
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Operación y Reportes</h4>
                        <p className="text-emerald-100/90">
                          Control de procesos, documentos y reportes
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Gestión de Usuarios</h4>
                        <p className="text-emerald-100/90">
                          Control de permisos y accesos del equipo
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/20 pt-6">
                    <p className="text-emerald-100/80 text-sm">
                      ⚠️ Acceso restringido: solo para administradores y personal autorizado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer para la página de login (opcional) */}
      <footer className="mt-12 pt-8 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Coldesthetic. Panel Admin.</p>
            <p className="mt-1">Todos los derechos reservados. Uso autorizado exclusivo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
