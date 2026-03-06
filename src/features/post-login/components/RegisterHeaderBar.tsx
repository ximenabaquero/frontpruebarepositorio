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

  const activeBtn =
    "rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold shrink-0 transition-all duration-200 bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-200";

  const inactiveBtn =
    "rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold shrink-0 transition-all duration-200 border border-gray-200 bg-white text-gray-600 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-md hover:shadow-emerald-100";

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
            className={active === "register" ? activeBtn : inactiveBtn}
          >
            Registro
          </button>
        )}

        {onPatientsClick && (
          <button
            type="button"
            onClick={onPatientsClick}
            className={active === "patients" ? activeBtn : inactiveBtn}
          >
            Pacientes
          </button>
        )}

        {user?.role === "ADMIN" && onStatsClick && (
          <button
            type="button"
            onClick={onStatsClick}
            className={active === "stats" ? activeBtn : inactiveBtn}
          >
            Estadísticas
          </button>
        )}

        {onImagesClick && (
          <button
            type="button"
            onClick={onImagesClick}
            className={active === "images" ? activeBtn : inactiveBtn}
          >
            Imágenes
          </button>
        )}

        {user?.role === "ADMIN" && onRemitentesClick && (
          <button
            type="button"
            onClick={onRemitentesClick}
            className={active === "remitentes" ? activeBtn : inactiveBtn}
          >
            Remitentes
          </button>
        )}
      </div>
    </div>
  );
}
