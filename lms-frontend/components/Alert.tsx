export function Alert({ type, message }: { type: "error" | "success"; message: string }) {
  const isError = type === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`rounded-xl border px-4 py-3 text-sm ${
        isError
          ? "border-danger/20 bg-danger-soft text-danger"
          : "border-success/20 bg-success-soft text-success"
      }`}
    >
      {message}
    </div>
  );
}
