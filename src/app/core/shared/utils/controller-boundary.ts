import { ZodError } from 'zod';
import type { Observable } from 'rxjs';

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

/**
 * `run()` es para trabajo que resuelve un valor de una sola vez, no para exponer un stream sin
 * gestionar sus propios errores. Si `fn` devuelve un Observable, TypeScript marca error de tipos
 * al llamar a `run` (T colapsa a `never`).
 */
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

/**
 * Clase base para controllers: ejecuta una operación y la envuelve en un `ControllerResult`,
 * sin que el llamador necesite try/catch.
 *
 * Reemplaza a `ControllerException` (ver errors.ts): el nombre cambia porque esta clase nunca
 * lanza ni representa una excepción — es un wrapper de ejecución segura.
 */
export abstract class ControllerBoundary {
  /** Para trabajo síncrono (lecturas de un signal, parseos de DTO). */
  run<T>(fn: () => NotObservable<T>, origin: string): ControllerResult<T> {
    try {
      return { ok: true, data: fn() };
    } catch (e) {
      return toErrorResult(e, origin);
    }
  }

  /** Para trabajo async (llamadas al repository que escriben en Dexie). */
  async runAsync<T>(fn: () => Promise<T>, origin: string): Promise<ControllerResult<T>> {
    try {
      return { ok: true, data: await fn() };
    } catch (e) {
      return toErrorResult(e, origin);
    }
  }

  /**
   * Para exponer un stream en vivo (ej. un `liveQuery` de Dexie). Solo protege la construcción
   * síncrona (ej. el parseo del id) — los errores que ocurran dentro del stream ya emitido no
   * pasan por acá, quien se suscribe a `data` los maneja.
   */
  runStream<T>(fn: () => Observable<T>, origin: string): ControllerResult<Observable<T>> {
    try {
      return { ok: true, data: fn() };
    } catch (e) {
      return toErrorResult(e, origin);
    }
  }
}
