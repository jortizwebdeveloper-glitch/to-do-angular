import type { Observable } from 'rxjs';
import { ZodError } from 'zod';

interface SuccessResult<T> {
  ok: true;
  data: T;
}

interface ErrorResult {
  ok: false;
  error: unknown;
  message: string;
}

export type ControllerResult<T> = SuccessResult<T> | ErrorResult;

type NotObservable<T> = T extends Observable<unknown> ? never : T;

function toErrorResult(e: unknown, origin: string): ErrorResult {
  console.error(origin, e);
  if (e instanceof ZodError) {
    return {
      ok: false,
      error: e,
      message: e.issues[0]?.message ?? 'Los datos ingresados no son válidos',
    };
  }
  return {
    ok: false,
    error: e,
    message: 'Ocurrió un error inesperado',
  };
}

export abstract class ControllerBoundary {
  run<T>(fn: () => NotObservable<T>, origin: string): ControllerResult<T> {
    try {
      return { ok: true, data: fn() };
    } catch (e) {
      return toErrorResult(e, origin);
    }
  }

  async runAsync<T>(fn: () => Promise<T>, origin: string): Promise<ControllerResult<T>> {
    try {
      return { ok: true, data: await fn() };
    } catch (e) {
      return toErrorResult(e, origin);
    }
  }
}
