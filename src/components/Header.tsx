"use client";

import { Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const readAuth = () => {
      try {
        return window.localStorage.getItem("coldesthetic_admin_authed") === "1";
      } catch {
        return false;
      }
    };

    setIsAuthed(readAuth());
    const onStorage = () => setIsAuthed(readAuth());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("coldesthetic_admin_authed");
    } catch {
      // ignore
    }
    setIsAuthed(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 p-[2px] shadow-sm">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src="/coldestheticlogo.png"
                  alt="Coldesthetic"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <Link href="/">
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity">
                  Coldesthetic
                </h1>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6"></nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Teléfono */}
            <a
              href="tel:+573001434089"
              className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              aria-label="Llamar"
            >
              <Phone size={16} />
              <span className="text-sm font-medium">+57 300 143 4089</span>
            </a>

            {isAuthed ? (
              <>
                <Link
                  href="/patients"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                >
                  <span className="text-sm font-medium">Pacientes</span>
                </Link>

                <Link
                  href="/stats"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                >
                  <span className="text-sm font-medium">Estadísticas</span>
                </Link>

                <Link
                  href="/control-images"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                >
                  <span className="text-sm font-medium">Imágenes</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors duration-200"
                >
                  <span className="hidden sm:inline">Cerrar sesión</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-blue-700 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors duration-200">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700 hover:text-emerald-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <div className="pt-3 mt-2 border-t border-gray-100">
                <a
                  href="tel:+573001434089"
                  className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone size={18} />
                  <span className="font-medium">+57 300 143 4089</span>
                </a>

                {/* Login en mobile */}
                {isAuthed ? (
                  <>
                    <Link
                      href="/patients"
                      className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Pacientes</span>
                    </Link>

                    <Link
                      href="/stats"
                      className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Estadísticas</span>
                    </Link>

                    <Link
                      href="/control-images"
                      className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Imágenes</span>
                    </Link>

                    <button
                      type="button"
                      className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 font-medium py-2"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <span>Cerrar sesión</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-3 text-emerald-600 hover:text-blue-700 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Iniciar Sesión</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
