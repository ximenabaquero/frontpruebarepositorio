type FormAlertProps = {
  variant: "error" | "success" | "warning";
  message: string;
};

export default function FormAlert({ variant, message }: FormAlertProps) {
  const styles = {
    error:
      "rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm",
    success:
      "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm",
    warning:
      "rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900 shadow-sm",
  };

  return (
    <div
      className={styles[variant]}
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {message}
    </div>
  );
}
