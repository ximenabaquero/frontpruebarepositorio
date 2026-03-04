"use client";

import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-sm border-b border-gray-100"
          : "bg-white/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 p-[2px] shadow-md group-hover:shadow-emerald-200 transition-shadow duration-300">
              <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
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
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent tracking-tight">
              Coldesthetic
            </span>
          </Link>

          {/* Right section */}
          <div className="flex items-center gap-2">

            {/* Phone */}
            <a
              href="tel:+573001434089"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              aria-label="Llamar"
            >
              <Phone size={15} className="flex-shrink-0" />
              <span className="text-sm font-medium">+57 300 143 4089</span>
            </a>

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1" />

            {/* Auth */}
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-blue-600 shadow-sm hover:shadow-emerald-200 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Iniciar sesión</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden ml-1 p-2 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 pb-4">
            <div className="flex flex-col gap-1">
              <a
                href="tel:+573001434089"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone size={17} />
                <span className="font-medium text-sm">+57 300 143 4089</span>
              </a>

              {user ? (
                <button
                  type="button"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all duration-200 text-left"
                  onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  <span className="font-medium text-sm">Cerrar sesión</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all duration-200 font-medium text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Iniciar sesión</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}