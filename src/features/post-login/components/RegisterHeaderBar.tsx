type RegisterHeaderBarProps = {
  onPatientsClick?: () => void;
  onBackToRegisterClick?: () => void;

  onStatsClick?: () => void;
  onImagesClick?: () => void;

  active?: "register" | "patients" | "stats" | "images";
};

export default function RegisterHeaderBar({
  onPatientsClick,
  onBackToRegisterClick,
  onStatsClick,
  onImagesClick,
  active = "register",
}: RegisterHeaderBarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-4 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
        Uso interno (doctor)
      </div>

      <div className="flex items-center gap-2">
        {onBackToRegisterClick && (
          <button
            type="button"
            onClick={onBackToRegisterClick}
            className={
              active === "register"
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm"
                : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm"
                : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            }
          >
            Pacientes
          </button>
        )}

        {onStatsClick && (
          <button
            type="button"
            onClick={onStatsClick}
            className={
              active === "stats"
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm"
                : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
                ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm"
                : "rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            }
          >
            Imágenes
          </button>
        )}
      </div>
    </div>
  );
}
