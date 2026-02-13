import type { ReactNode } from "react";

type RegisterCardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export default function RegisterCard({
  title = "",
  subtitle = "",
  children,
}: RegisterCardProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4">
        <div className="text-sm font-semibold text-white/95">{title}</div>
        <div className="mt-0.5 text-xs text-white/80">{subtitle}</div>
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}
