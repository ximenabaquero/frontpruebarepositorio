"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import {
  LockClosedIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, authChecked, isLoggingOut } = useAuth();
  const alertShown = useRef(false);

  const showAlertOnce = (msg: string) => {
    if (!alertShown.current) {
      alertShown.current = true;
      alert(msg);
    }
  };

  useEffect(() => {
    if (!authChecked || isLoggingOut) return;

    if (!user) {
      showAlertOnce("🚫 Solo personas autorizadas pueden acceder.");
      router.replace("/");
    }
  }, [authChecked, user, isLoggingOut, router]);

  if (!authChecked) return null;

  if (!user && !isLoggingOut) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#fde8e8] shadow-xl shadow-gray-400/40">
              <div className="relative">
                <LockClosedIcon className="h-10 w-10 text-[#e11d48]" />
                <UserIcon className="h-4 w-4 text-[#f43f5e] absolute -bottom-1 -right-1" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-semibold text-gray-900 mb-3">
            Acceso Restringido
          </h1>

          <p className="text-gray-600 mb-15">
            Solo personas autorizadas pueden acceder a esta sección del sistema.
          </p>

          <div className="flex items-center w-full max-w-xs mx-auto uppercase tracking-wider text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-300/60" />
            <div className="flex items-center px-3 whitespace-nowrap">
              <ShieldCheckIcon className="h-4 w-4 mr-1" />
              Sistema de Seguridad
            </div>
            <div className="flex-1 h-px bg-gray-300/60" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
