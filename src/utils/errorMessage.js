export function getErrorMessage(error, fallback = "Ocurrió un error") {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error instanceof Error && error.message) return error.message;
  if (error.message) return String(error.message);
  if (typeof error === "object") {
    try {
      const text = JSON.stringify(error);
      if (text && text !== "{}") return text;
    } catch {
      // ignore
    }
  }
  if (typeof error.toString === "function") {
    const text = error.toString();
    if (text && text !== "[object Object]") return text;
  }
  return fallback;
}
