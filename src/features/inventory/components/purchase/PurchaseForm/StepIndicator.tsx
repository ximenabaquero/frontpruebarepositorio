"use client";

const STEPS = ["Producto", "Distribuidor", "Compra"];

interface Props {
  currentStep: number; // 1-based
}

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-start justify-between w-full px-2">
      {STEPS.map((label, idx) => {
        const stepNum = idx + 1;
        const completed = stepNum < currentStep;
        const active = stepNum === currentStep;

        return (
          <div
            key={label}
            className="flex flex-col items-center flex-1 relative"
          >
            {/* Línea conectora izquierda */}
            {idx > 0 && (
              <div
                className="absolute left-0 top-[18px] w-1/2 h-[3px] -translate-y-1/2"
                style={{
                  backgroundColor:
                    stepNum <= currentStep ? "#2563EB" : "#E2E8F0",
                }}
              />
            )}

            {/* Línea conectora derecha */}
            {idx < STEPS.length - 1 && (
              <div
                className="absolute right-0 top-[18px] w-1/2 h-[3px] -translate-y-1/2"
                style={{ backgroundColor: completed ? "#2563EB" : "#E2E8F0" }}
              />
            )}

            {/* Círculo */}
            <div
              className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300"
              style={{
                backgroundColor: completed
                  ? "#2563EB"
                  : active
                    ? "#ffffff"
                    : "#F1F5F9",
                borderColor: completed || active ? "#2563EB" : "#CBD5E1",
              }}
            >
              {completed ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span
                  className="text-xs font-bold"
                  style={{ color: active ? "#2563EB" : "#94A3B8" }}
                >
                  {stepNum}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              className="mt-2 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: active || completed ? "#2563EB" : "#94A3B8" }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
