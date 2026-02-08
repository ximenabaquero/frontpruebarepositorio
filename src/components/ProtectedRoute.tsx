"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
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
      showAlertOnce("❌​ Solo los administradores tienen acceso.");
      router.replace("/");
    }
  }, [authChecked, user, isLoggingOut, router]);

  if (!authChecked) return null;

  if (!user && !isLoggingOut) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-gray-800 text-lg font-semibold">
          ❌​ Solo los administradores tienen acceso.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
