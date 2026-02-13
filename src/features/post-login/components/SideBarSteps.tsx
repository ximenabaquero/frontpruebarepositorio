interface SidebarStepsProps {
  steps: { label: string; completed: boolean }[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export default function SidebarSteps({
  steps,
  currentStep,
  onStepClick,
}: SidebarStepsProps) {
  return (
    <aside className="sticky top-10 rounded-3xl bg-white shadow-md border border-gray-100 p-6 min-h-[520px]">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 tracking-wide">
          Registro clínico
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Completa los pasos del formulario médico.
        </p>
      </div>

      <ol className="relative space-y-6">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = step.completed;
          const showConnector = index < steps.length - 1;

          return (
            <li key={step.label} className="relative pl-9 pb-10 last:pb-0">
              {/* Número o check */}
              <span
                className={[
                  "absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  isCompleted
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : isActive
                      ? "border-emerald-600 bg-white text-emerald-600"
                      : "border-gray-300 bg-white text-gray-400",
                ].join(" ")}
              >
                {isCompleted ? (
                  <svg viewBox="0 0 20 20" className="h-4 w-4">
                    <path
                      d="M7.629 13.233 4.5 10.104l1.414-1.414 1.715 1.715L14.086 4.95l1.414 1.414-7.871 6.869z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>

              {/* Línea vertical */}
              {showConnector && (
                <span
                  className={[
                    "absolute left-2.5 top-6 h-8 w-0.5",
                    steps[index + 1].completed || isCompleted
                      ? "bg-emerald-500"
                      : "bg-gray-200",
                  ].join(" ")}
                />
              )}

              {/* Encabezado del paso */}
              <div className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Paso {index + 1}
              </div>

              {/* Botón del paso */}
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                className={[
                  "w-full text-left text-base font-medium rounded-lg px-3 py-2 transition",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                {step.label}
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
