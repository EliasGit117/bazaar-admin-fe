import type { IApiException } from '@/main.tsx';
import { m } from '@/paraglide/messages';


export function isApiException(error: unknown): error is IApiException {
  if (typeof error !== "object" || error === null)
    return false;

  const e = error as any;

  return (
    typeof e.statusCode === "number" &&
    typeof e.error === "string" &&
    (typeof e.message === "string" || (Array.isArray(e.message) && e.message.every((m: unknown) => typeof m === "string")))
  );
}

export function normalizeError(error: IApiException | Error | unknown): Error {
  if (isApiException(error)) {
    console.log(error)
    const message = Array.isArray(error.message) ? error.message.join(", ") : error.message;

    const exError = new Error(message);
    exError.name = error.error;

    return exError;
  }

  if (error instanceof Error)
    return error;

  return new Error(m['errors.unknown_error']());
}