"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  Mail,
  Lock,
  Shield,
  Home,
  User,
  ArrowRight,
} from "lucide-react";
import ValidatedInput from "@/components/ValidatedInput";
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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

  const floatStyles = useMemo<CSSProperties[]>(() => {
    const rand = mulberry32(246810);
    return Array.from({ length: 12 }, () => {
      const size = rand() * 100 + 50;
      const left = rand() * 100;
      const top = rand() * 100;
      // Animación un poco más rápida (8s a 14s) para que se note el movimiento
      const duration = rand() * 6 + 8; 
      const delay = rand() * -20; // Delay negativo para que empiecen ya movidos
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        animation: `float-intense ${duration}s ease-in-out ${delay}s infinite alternate`,
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
      await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      const token = Cookies.get("XSRF-TOKEN") ?? "";

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

      setUser(data.user);

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/dashboard";
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

  const handleEmailChange = (val: string) =>
    setFormData((prev) => ({ ...prev, email: val }));
  const handlePasswordChange = (val: string) =>
    setFormData((prev) => ({ ...prev, password: val }));

  return (
    <div className="min-h-screen flex flex-col" style={{background:'#FAFDFB'}}>
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {floatStyles.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{...style, background:'rgba(196,251,233,0.65)'}}
          />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes float-intense {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(20px, -20px) scale(1); }
        }
        .login-nav-logo {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.65rem;
          color: #0A1F1A;
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1;
          text-decoration: none;
        }
      `}</style>

      {/* Header — mismo estilo que la home */}
      <header style={{ position:'sticky', top:0, width:'100%', zIndex:50, background:'rgba(250,253,251,.78)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', borderBottom:'1px solid rgba(10,31,26,.10)', padding:'20px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" className="login-nav-logo">
          <span>o</span>lga
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 transition-colors text-sm" style={{color:'#4A6B62'}}
          onMouseEnter={e => (e.currentTarget.style.color='#0FB888')}
          onMouseLeave={e => (e.currentTarget.style.color='#4A6B62')}
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Volver al inicio</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md mx-auto">
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
            <div className="h-2" style={{background:'#0FB888'}}></div>

            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <Image
                      src="/a-Olga.png"
                      alt="Olga"
                      width={96}
                      height={96}
                      className="w-full h-full object-contain drop-shadow-md"
                      priority
                    />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-2" style={{background:'rgba(15,184,136,0.10)', border:'1px solid rgba(15,184,136,0.22)'}}>
                  <Shield className="w-4 h-4" style={{color:'#0FB888'}} />
                  <span className="text-sm font-semibold" style={{color:'#0A1F1A'}}>
                    Sistema de Acceso Privado
                  </span>
                </div>

                <p className="text-[11px] mb-4" style={{color:'#7A9189'}}>
                  EPS Contributiva · Subsidiada · Prepagada · Régimen Especial
                </p>

                {/* Multi-pagador */}
                <div className="w-full mb-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Selecciona tu organización</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["EPS Sura", "Compensar", "Nueva EPS", "Salud Total"].map((payer, idx) => (
                      <span
                        key={payer}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-default"
                        style={idx === 0
                          ? {background:'#0FB888', borderColor:'#0FB888', color:'#fff'}
                          : {background:'#fff', color:'#4A6B62', borderColor:'rgba(10,31,26,0.12)'}
                        }
                      >
                        {payer}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                <ValidatedInput
                  id="email"
                  label="Correo Electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleEmailChange}
                  maxLength={150}
                  required
                />

                <ValidatedInput
                  id="password"
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  maxLength={128}
                  required
                  showToggle
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full py-3 px-6 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{background:'#0FB888'}}
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
          {/* ... Resto del componente idéntico ... */}
          <div className="mt-10 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3 text-gray-500" />
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold text-center">
                Acceso Restringido a Personal Autorizado
              </p>
            </div>
            <div className="mt-5 w-24 h-[1px] bg-gray-300"></div>
          </div>

          <div className="mt-4 px-3 py-2 rounded-xl" style={{background:'rgba(15,184,136,0.07)', border:'1px solid rgba(15,184,136,0.22)'}}>
            <p className="text-[11px] leading-tight text-gray-500 text-center">
              Este sistema contiene información privada y protegida. El acceso
              no autorizado está estrictamente prohibido y sujeto a acciones
              legales.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-3 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center text-[11px] text-gray-400 leading-tight">
            <p>© {new Date().getFullYear()} Olga · Sistema de gestión</p>
            <p>Uso autorizado exclusivo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}