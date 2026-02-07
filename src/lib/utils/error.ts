import type { IApiException } from '@/main.tsx';

export function isApiException(error: unknown): error is IApiException {
  if (typeof error !== "object" || error === null)
    return false;

  return (
    "statusCode" in error && typeof (error as any).statusCode === "number" &&
    "error" in error && typeof (error as any).error === "string" &&
    "message" in error && typeof (error as any).message === "string"
  );
}

export function normalizeError(error: IApiException | Error | unknown): Error {
  if (isApiException(error)) {
    const exError = new Error(error.message);
    exError.name = error.error;
    return exError;
  }

  if (error instanceof Error)
    return error;

  return new Error('Unknown error');
}