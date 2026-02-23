"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";

type Role = "ADMIN" | "REMITENTE";

export default function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) {
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

    // No logueado
    if (!user) {
      router.replace("/");
      return;
    }

    // Rol no permitido
    if (!allow.includes(user.role)) {
      showAlertOnce("🚫 Solo personas autorizadas pueden acceder.");
      router.replace("/dashboard");
    }
  }, [user, authChecked, isLoggingOut, allow, router]);

  if (!authChecked || !user) return null;

  if (!allow.includes(user.role)) return null;

  return <>{children}</>;
}
