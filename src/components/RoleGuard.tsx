"use client";

import { ReactNode, useEffect } from "react";
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

  useEffect(() => {
    if (!authChecked || isLoggingOut) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (!allow.includes(user.role)) {
      router.replace("/register-patient");
    }
  }, [user, authChecked, isLoggingOut, allow, router]);

  if (!authChecked || !user) return null;

  if (!allow.includes(user.role)) return null;

  return <>{children}</>;
}
