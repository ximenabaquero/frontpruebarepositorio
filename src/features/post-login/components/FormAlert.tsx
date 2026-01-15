type FormAlertProps = {
  variant: "error" | "success";
  message: string;
};

export default function FormAlert({ variant, message }: FormAlertProps) {
  const isError = variant === "error";

  return (
    <div
      className={
        isError
          ? "rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm"
          : "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm"
      }
      role={isError ? "alert" : "status"}
      aria-live="polite"
    >
      {message}
    </div>
  );
}
