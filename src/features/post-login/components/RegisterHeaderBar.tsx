import { useAuth } from "@/features/auth/AuthContext";

type RegisterHeaderBarProps = {
  onPatientsClick?: () => void;
  onBackToRegisterClick?: () => void;
  onStatsClick?: () => void;
  onImagesClick?: () => void;
  onRemitentesClick?: () => void;
  active?: "register" | "patients" | "stats" | "images" | "remitentes";
};

export default function RegisterHeaderBar({
  onPatientsClick,
  onBackToRegisterClick,
  onStatsClick,
  onImagesClick,
  onRemitentesClick,
  active = "register",
}: RegisterHeaderBarProps) {
  const { user } = useAuth();
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-4 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
        Uso interno (doctor)
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-wrap sm:flex-nowrap sm:pb-0">
        {onBackToRegisterClick && (
          <button
            type="button"
            onClick={onBackToRegisterClick}
            className={
              active === "register"
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm shrink-0"
                : "rounded-xl border border-gray-200 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shrink-0"
            }
          >
            Registro
          </button>
        )}

        {onPatientsClick && (
          <button
            type="button"
            onClick={onPatientsClick}
            className={
              active === "patients"
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm shrink-0"
                : "rounded-xl border border-gray-200 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shrink-0"
            }
          >
            Pacientes
          </button>
        )}

        {/* SOLO ADMIN VE ESTADÍSTICAS */}
        {user?.role === "ADMIN" && onStatsClick && (
          <button
            type="button"
            onClick={onStatsClick}
            className={
              active === "stats"
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm shrink-0"
                : "rounded-xl border border-gray-200 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shrink-0"
            }
          >
            Estadísticas
          </button>
        )}

        {onImagesClick && (
          <button
            type="button"
            onClick={onImagesClick}
            className={
              active === "images"
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm shrink-0"
                : "rounded-xl border border-gray-200 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shrink-0"
            }
          >
            Imágenes
          </button>
        )}

        {/* SOLO ADMIN VE REMITENTES */}
        {user?.role === "ADMIN" && onRemitentesClick && (
          <button
            type="button"
            onClick={onRemitentesClick}
            className={
              active === "remitentes"
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-emerald-800 shadow-sm shrink-0"
                : "rounded-xl border border-gray-200 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shrink-0"
            }
          >
            Remitentes
          </button>
        )}
      </div>
    </div>
  );
}
